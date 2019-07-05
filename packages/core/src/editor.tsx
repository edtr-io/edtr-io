import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HotKeys } from 'react-hotkeys'

import { Document } from './document'
import {
  ScopeContext,
  Provider,
  connect,
  EditorContext,
  EditableContext,
  ScopedActionCreator
} from './editor-context'
import { OverlayContextProvider } from './overlay'
import { Plugin } from './plugin'
import { createStore, actions, selectors } from './store'
import { ChangeListener } from './store/store'

const MAIN_SCOPE = 'main'
export function Editor<K extends string = string>(props: EditorProps<K>) {
  const store = React.useMemo(() => {
    return createStore({
      instances: {
        [MAIN_SCOPE]: {
          plugins: props.plugins,
          defaultPlugin: props.defaultPlugin,
          onChange: props.onChange
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
      <InnerEditor {...props} scope={MAIN_SCOPE} mirror={false} />
    )
    if (props.omitDragDropContext) return children
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        {children}
      </DragDropContextProvider>
    )
  }
}

export const StoreProvider: React.FunctionComponent<{
  omitDragDropContext?: boolean
}> = props => {
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

export function EditorInstance<K extends string = string>(
  props: EditorProps<K> & InnerEditorProps
) {
  const { store } = React.useContext(EditorContext)
  const isMainInstance = React.useRef(
    store && store.getState()[props.scope] && !props.mirror
  )
  // this needs to be outside of useEffect to make sure it happens before the initRoot of the instance itself
  React.useEffect(() => {
    if (isMainInstance.current) {
      // eslint-disable-next-line no-console
      console.warn(
        'An editor instance with this scope was already initialized. This resets the state and actions! Please set mirror prop to false on one instance.'
      )
    }
  }, [isMainInstance])

  if (!store) {
    // eslint-disable-next-line no-console
    console.error(
      'Could not connect to Redux Store. Please make sure to wrap all instances of EditorInstance in a StoreProvider'
    )
    return null
  }
  return <InnerEditor {...props} />
}

const defaultTheme: CustomTheme = {}
const hotKeysKeyMap = {
  UNDO: 'mod+z',
  REDO: ['mod+y', 'mod+shift+z']
}
export const InnerEditor = connect<
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
)(function InnerEditor<K extends string = string>({
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
  editable = true,
  theme = defaultTheme
}: EditorProps<K> & InnerEditorProps & EditorStateProps & EditorDispatchProps) {
  React.useEffect(() => {
    if (!mirror) {
      initRoot({ initialState, plugins, defaultPlugin })
    }
  }, [defaultPlugin, initRoot, initialState, mirror, plugins])

  const hotKeysHandlers = React.useMemo(() => {
    return {
      UNDO: undo,
      REDO: redo
    }
  }, [undo, redo])

  if (!id) return null

  return (
    <HotKeys
      focused
      attach={document.body}
      keyMap={hotKeysKeyMap}
      handlers={hotKeysHandlers}
    >
      <div style={{ position: 'relative' }}>
        <RootThemeProvider theme={theme}>
          <OverlayContextProvider>
            <ScopeContext.Provider value={scope}>
              <EditableContext.Provider value={editable}>
                {renderChildren(id)}
              </EditableContext.Provider>
            </ScopeContext.Provider>
          </OverlayContextProvider>
        </RootThemeProvider>
      </div>
    </HotKeys>
  )

  function renderChildren(id: string) {
    const document = <Document id={id} scope={scope} editable={editable} />

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
// eslint-disable-next-line @typescript-eslint/prefer-interface
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

export interface InnerEditorProps {
  scope: string
  mirror: boolean
}
