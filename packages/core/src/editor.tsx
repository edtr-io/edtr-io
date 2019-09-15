/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Plugin } from '@edtr-io/abstract-plugin'
import {
  initRoot,
  undo,
  redo,
  getPendingChanges,
  getRoot,
  hasPendingChanges,
  serializeRootDocument,
  createStore,
  ChangeListener,
  StoreEnhancerFactory
} from '@edtr-io/store'
import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { configure, GlobalHotKeys } from 'react-hotkeys'

import { SubDocument } from './document'
import { OverlayContextProvider } from './overlay'
import { PreferenceContextProvider } from './preference-context'
import {
  Provider,
  EditorContext,
  ScopeContext,
  ErrorContext,
  useSelector,
  useDispatch,
  useScopedStore
} from './store'

configure({
  ignoreEventsCondition() {
    return false
  }
})

const MAIN_SCOPE = 'main'

let mountedProvider = false
const mountedScopes: Record<string, boolean> = {}

export function Editor<K extends string = string>({
  createStoreEnhancer = defaultEnhancer => defaultEnhancer,
  ...props
}: EditorProps<K>) {
  const store = React.useMemo(() => {
    return createStore({
      instances: {
        [MAIN_SCOPE]: {
          plugins: props.plugins,
          defaultPlugin: props.defaultPlugin
        }
      },
      createEnhancer: createStoreEnhancer
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
  createStoreEnhancer?: StoreEnhancerFactory
}> = ({
  createStoreEnhancer = defaultEnhancer => defaultEnhancer,
  ...props
}) => {
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
      instances: {},
      createEnhancer: createStoreEnhancer
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
  UNDO: ['ctrl+z', 'command+z'],
  REDO: ['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z']
}

export function InnerDocument<K extends string = string>({
  children,
  initialState,
  mirror,
  plugins,
  defaultPlugin,
  scope,
  editable,
  theme = defaultTheme,
  onChange,
  onError
}: EditorProps<K> & { scope: string; mirror?: boolean }) {
  // Can't use `useScopedSelector` here since `InnerDocument` initializes the scoped state and `ScopeContext`
  const id = useSelector(state => {
    const scopedState = state[scope]
    if (!scopedState) return null
    return getRoot()(scopedState)
  })
  const dispatch = useDispatch()
  const store = useScopedStore()
  React.useEffect(() => {
    if (typeof onChange !== 'function') return
    let pendingChanges = getPendingChanges()(store.getState())
    return store.subscribe(() => {
      const currentPendingChanges = getPendingChanges()(store.getState())
      if (currentPendingChanges !== pendingChanges) {
        onChange({
          changed: hasPendingChanges()(store.getState()),
          getDocument: () => serializeRootDocument()(store.getState())
        })
        pendingChanges = currentPendingChanges
      }
    })
  }, [onChange, store])

  React.useEffect(() => {
    if (!mirror) {
      dispatch(initRoot({ initialState, plugins, defaultPlugin })(scope))
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
      UNDO: () => dispatch(undo()(scope)),
      REDO: () => dispatch(redo()(scope))
    }
  }, [dispatch, scope])

  if (!id) return null

  return (
    <GlobalHotKeys
      allowChanges
      keyMap={hotKeysKeyMap}
      handlers={hotKeysHandlers}
    >
      <div style={{ position: 'relative' }}>
        <ErrorContext.Provider value={onError}>
          <RootThemeProvider theme={theme}>
            <OverlayContextProvider>
              <PreferenceContextProvider>
                <ScopeContext.Provider value={scopeContextValue}>
                  {renderChildren(id)}
                </ScopeContext.Provider>
              </PreferenceContextProvider>
            </OverlayContextProvider>
          </RootThemeProvider>
        </ErrorContext.Provider>
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
  createStoreEnhancer?: StoreEnhancerFactory
  onError?: React.ContextType<typeof ErrorContext>
}
