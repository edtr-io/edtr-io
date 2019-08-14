import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { configure, GlobalHotKeys } from 'react-hotkeys'

import { SubDocument } from './document'
import {
  connect,
  Provider,
  EditorContext,
  ScopeContext
} from './editor-context'
import { useStore } from './hooks'
import { OverlayContextProvider } from './overlay'
import { Plugin } from './plugin'
import {
  actions,
  selectors,
  createStore,
  ChangeListener,
  ScopedActionCreator
} from './store'

configure({
  ignoreEventsCondition() {
    return false
  }
})

const MAIN_SCOPE = 'main'

let mountedProvider = false
const mountedScopes: Record<string, boolean> = {}

export function Editor<K extends string = string>(props: EditorProps<K>) {
  const store = React.useMemo(() => {
    return createStore({
      instances: {
        [MAIN_SCOPE]: {
          plugins: props.plugins,
          defaultPlugin: props.defaultPlugin
        }
      }
    }).store
    // We want to create the store only once
    // TODO: add effects that handle changes to plugins and defaultPlugin (by dispatching an action)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Provider store={store}>{renderChildren()}</Provider>

  function renderChildren() {
    const children = (
      <InnerDocument
        {...props}
        scope={MAIN_SCOPE}
        editable={props.editable === undefined ? true : props.editable}
      />
    )
    if (props.omitDragDropContext) return children
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        {children}
      </DragDropContextProvider>
    )
  }
}

export const EditorProvider: React.FunctionComponent<{
  omitDragDropContext?: boolean
}> = props => {
  React.useEffect(() => {
    if (mountedProvider) {
      // eslint-disable-next-line no-console
      console.error('You may only render one <EditorProvider />.')
    }
    mountedProvider = true
    return () => {
      mountedProvider = false
    }
  }, [])
  const store = React.useMemo(() => {
    return createStore({
      instances: {}
    }).store
    // We want to create the store only once
    // TODO: add effects that handle changes to plugins and defaultPlugin (by dispatching an action)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const children = <Provider store={store}>{props.children}</Provider>
  if (props.omitDragDropContext) return children
  return (
    <DragDropContextProvider backend={HTML5Backend}>
      {children}
    </DragDropContextProvider>
  )
}

export function Document<K extends string = string>({
  scope = MAIN_SCOPE,
  mirror,
  ...props
}: EditorProps<K> & { scope?: string; mirror?: boolean }) {
  const storeContext = React.useContext(EditorContext)
  React.useEffect(() => {
    const isMainInstance = !mirror
    if (isMainInstance) {
      if (mountedScopes[scope]) {
        // eslint-disable-next-line no-console
        console.error(
          `There are multiple main instances for scope ${scope}. Please set the mirror prop to true to all but one instance.`
        )
        mountedScopes[scope] = true
        return () => {
          mountedScopes[scope] = false
        }
      }
    }
  }, [mirror, scope])

  if (!storeContext) {
    // eslint-disable-next-line no-console
    console.error(
      'Could not connect to Redux Store. Please make sure to wrap all instances of Document in an EditorProvider'
    )
    return null
  }

  return <InnerDocument scope={scope} mirror={mirror} {...props} />
}

const defaultTheme: CustomTheme = {}
const hotKeysKeyMap = {
  FOO: 'a',
  UNDO: ['ctrl+z', 'command+z'],
  REDO: ['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z']
}

export const InnerDocument = connect<
  EditorStateProps,
  EditorDispatchProps,
  EditorProps & { scope: string }
>(
  (state): EditorStateProps => {
    return {
      id: selectors.getRoot(state)
    }
  },
  {
    initRoot: actions.initRoot,
    undo: actions.undo,
    redo: actions.redo
  }
)(function InnerDocument<K extends string = string>({
  id,
  initRoot,
  undo,
  redo,
  children,
  initialState,
  mirror,
  plugins,
  defaultPlugin,
  scope,
  editable,
  theme = defaultTheme,
  onChange
}: EditorProps<K> & { scope: string; mirror?: boolean } & EditorStateProps &
  EditorDispatchProps) {
  const store = useStore()
  React.useEffect(() => {
    if (typeof onChange !== 'function') return
    let pendingChanges = selectors.getPendingChanges(store.getState())
    return store.subscribe(() => {
      const currentPendingChanges = selectors.getPendingChanges(
        store.getState()
      )
      if (currentPendingChanges !== pendingChanges) {
        onChange({
          changed: selectors.hasPendingChanges(store.getState()),
          getDocument: () => selectors.serializeRootDocument(store.getState())
        })
        pendingChanges = currentPendingChanges
      }
    })
  }, [onChange, store])

  React.useEffect(() => {
    if (!mirror) {
      initRoot({ initialState, plugins, defaultPlugin })
    }
    // TODO: initRoot changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, plugins, defaultPlugin, mirror])
  const scopeContextValue = React.useMemo(() => {
    return {
      scope,
      editable
    }
  }, [scope, editable])
  const hotKeysHandlers = React.useMemo(() => {
    return {
      UNDO: undo,
      REDO: redo
    }
  }, [undo, redo])

  if (!id) return null

  return (
    <GlobalHotKeys
      allowChanges
      keyMap={hotKeysKeyMap}
      handlers={hotKeysHandlers}
    >
      <div style={{ position: 'relative' }}>
        <RootThemeProvider theme={theme}>
          <OverlayContextProvider>
            <ScopeContext.Provider value={scopeContextValue}>
              {renderChildren(id)}
            </ScopeContext.Provider>
          </OverlayContextProvider>
        </RootThemeProvider>
      </div>
    </GlobalHotKeys>
  )

  function renderChildren(id: string) {
    const document = <SubDocument id={id} />

    if (typeof children === 'function') {
      return children(document)
    }

    return (
      <React.Fragment>
        {document}
        {children}
      </React.Fragment>
    )
  }
})

export interface EditorStateProps {
  id: ReturnType<typeof selectors['getRoot']>
}

// Typescript somehow doesn't recognize an interface as Record<string, ..>
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EditorDispatchProps = {
  initRoot: ScopedActionCreator<typeof actions['initRoot']>
  undo: ScopedActionCreator<typeof actions['undo']>
  redo: ScopedActionCreator<typeof actions['redo']>
}

export interface EditorProps<K extends string = string> {
  omitDragDropContext?: boolean
  children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode)
  plugins: Record<K, Plugin>
  defaultPlugin: K
  initialState?: {
    plugin: string
    state?: unknown
  }
  theme?: CustomTheme
  onChange?: ChangeListener
  editable?: boolean
}
