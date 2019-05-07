import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

import { Document } from './document'
import {
  ActionType,
  AsyncChangeAction,
  CopyAction,
  createInitialState,
  FocusAction,
  getRoot,
  InitRootAction,
  pendingChanges,
  RedoAction,
  reducer,
  rootSaga,
  State,
  SwitchEditableAction,
  UndoAction
} from './store'
import { Plugin, PluginState } from './plugin'
import { OverlayContextProvider } from './overlay'
import { applyMiddleware, createStore as createReduxStore } from 'redux'
import { connect, Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

export const createStore = <K extends string>(
  plugins: Record<K, Plugin>,
  defaultPlugin: K,
  editable: boolean
) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createReduxStore(
    reducer,
    createInitialState(plugins, defaultPlugin, editable),
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(rootSaga)
  return store
}

export function Editor<K extends string = string>({
  plugins,
  defaultPlugin,
  initialState,
  changed,
  children,
  editable = true,
  theme = {}
}: EditorProps<K>) {
  const store = createStore(plugins, defaultPlugin, editable)

  const editorProps = {
    initialState,
    changed,
    children,
    editable,
    theme
  }
  return (
    <Provider store={store}>
      <EditorProvider {...editorProps} />
    </Provider>
  )
}

const mapStateToProps = (state: State): StateProps => ({
  root: getRoot(state),
  pendingChanges: pendingChanges(state)
})

const initRoot = (payload: {
  plugin?: string
  state?: unknown
}): InitRootAction => ({ type: ActionType.InitRoot, payload })
const switchEditable = (payload: boolean): SwitchEditableAction => ({
  type: ActionType.SwitchEditable,
  payload
})
const undo = (): UndoAction => ({ type: ActionType.Undo })
const redo = (): RedoAction => ({ type: ActionType.Redo })
export const copyToClipboard = (payload: string): CopyAction => ({
  type: ActionType.CopyToClipboard,
  payload
})
export const focus = (payload: string): FocusAction => ({
  type: ActionType.Focus,
  payload
})

export const change = (
  payload: AsyncChangeAction['payload']
): AsyncChangeAction => ({
  type: ActionType.AsyncChange,
  payload
})

const mapDispatchToProps: StateDispatchProps = {
  initRoot,
  switchEditable: switchEditable,
  undo: undo,
  redo: redo
}

export const EditorProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorConnector)

export function EditorConnector<K extends string = string>({
  initialState,
  changed,
  children,
  editable = true,
  theme,
  root,
  pendingChanges,
  initRoot,
  switchEditable,
  undo,
  redo
}: EditorConnectorProps & StateProps & StateDispatchProps) {
  React.useEffect(() => {
    initRoot(initialState || {})
  }, [initRoot, initialState])

  React.useEffect(() => {
    switchEditable(editable)
  }, [editable, switchEditable])

  const previousPendingChanges = React.useRef(0)
  React.useEffect(() => {
    if (changed && previousPendingChanges.current !== pendingChanges) {
      previousPendingChanges.current = pendingChanges
      changed(pendingChanges !== 0)
    }
  }, [changed, pendingChanges])

  if (!root) {
    return null
  }

  return (
    <HotKeys
      keyMap={{
        UNDO: 'mod+z',
        REDO: ['mod+y', 'mod+shift+z']
      }}
      handlers={{
        UNDO: undo,
        REDO: redo
      }}
    >
      <div style={{ position: 'relative' }}>
        <RootThemeProvider theme={theme}>
          <OverlayContextProvider>
            {renderChildren(root)}
          </OverlayContextProvider>
        </RootThemeProvider>
      </div>
    </HotKeys>
  )

  function renderChildren(id: string) {
    const document = <Document id={id} />

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
  children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode)
  plugins: Record<K, Plugin>
  defaultPlugin: K
  initialState?: PluginState
  theme?: CustomTheme
  changed?: (changed: boolean) => void
  editable?: boolean
}

export interface EditorConnectorProps {
  children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode)
  initialState?: PluginState
  changed?: (changed: boolean) => void
  editable?: boolean
  theme: CustomTheme
}

export interface StateProps {
  root?: string
  pendingChanges: number
}

export interface StateDispatchProps {
  initRoot: (payload: { plugin?: string; state?: unknown }) => InitRootAction
  switchEditable: (payload: boolean) => SwitchEditableAction
  undo: () => UndoAction
  redo: () => RedoAction
}
