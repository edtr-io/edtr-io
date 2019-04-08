import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Document } from './document'
import { EditorContext } from './editor-context'
import {
  ActionType,
  hasPendingChanges,
  reducer,
  createInitialState,
  getRoot,
  pendingChanges
} from './store'
import { Plugin } from './plugin'
import { OverlayContextProvider } from './overlay'
import { CustomEditorTheme, RootEditorThemeProvider } from '@edtr-io/ui'

export function Editor<K extends string = string>({
  plugins,
  defaultPlugin,
  initialState,
  changed,
  children,
  editable = true,
  theme = {}
}: EditorProps<K>) {
  const [state, dispatch] = React.useReducer(
    reducer,
    createInitialState(plugins, defaultPlugin, editable)
  )

  React.useEffect(() => {
    dispatch({
      type: ActionType.InitRoot,
      payload: initialState || {}
    })
  }, [dispatch, initialState])

  React.useEffect(() => {
    dispatch({
      type: ActionType.SwitchEditable,
      payload: editable
    })
  }, [editable])

  const id = getRoot(state)

  const pending = React.useRef(0)
  React.useEffect(() => {
    if (changed && pending.current !== pendingChanges(state)) {
      pending.current = pendingChanges(state)
      changed(hasPendingChanges(state))
    }
  }, [changed, state])

  if (!id) {
    return null
  }

  return (
    <HotKeys
      keyMap={{
        UNDO: 'mod+z',
        REDO: ['mod+y', 'mod+shift+z']
      }}
      handlers={{
        UNDO: () =>
          dispatch({
            type: ActionType.Undo
          }),
        REDO: () =>
          dispatch({
            type: ActionType.Redo
          })
      }}
    >
      <div style={{ position: 'relative' }}>
        <EditorContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          <RootEditorThemeProvider theme={theme}>
            <OverlayContextProvider>
              {renderChildren(id)}
            </OverlayContextProvider>
          </RootEditorThemeProvider>
        </EditorContext.Provider>
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
  initialState?: {
    plugin: string
    state?: unknown
  }
  theme?: CustomEditorTheme
  changed?: (changed: boolean) => void
  editable?: boolean
}
