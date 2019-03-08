import * as React from 'react'
import * as R from 'ramda'
import { HotKeys } from 'react-hotkeys'
import { Document } from './document'
import { EditorContext } from './editor-context'
import {
  ActionType,
  hasPendingChanges,
  reducer,
  createInitialState,
  getRoot,
  pendingChanges,
  PluginState
} from './store'
import { Plugin } from './plugin'

export function Editor<K extends string = string>({
  plugins,
  defaultPlugin,
  initialState,
  changed,
  children
}: EditorProps<K>) {
  const [state, dispatch] = React.useReducer(
    reducer,
    createInitialState(plugins, defaultPlugin)
  )
  const [clipboard, setClipboard] = React.useState<PluginState[]>([])

  React.useEffect(() => {
    dispatch({
      type: ActionType.InitRoot,
      payload: initialState || {}
    })
  }, [dispatch, initialState])

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
      <EditorContext.Provider
        value={{
          state,
          dispatch,
          clipboard: {
            get: () => clipboard,
            add: (state: PluginState) => {
              setClipboard(currentClipboard => {
                const maxLength = 10
                const appended = R.prepend(state, currentClipboard)
                return appended.length > maxLength
                  ? R.remove(maxLength, appended.length - maxLength, appended)
                  : appended
              })
            }
          }
        }}
      >
        <Document id={id} />
        {children}
      </EditorContext.Provider>
    </HotKeys>
  )
}

export interface EditorProps<K extends string = string> {
  children?: React.ReactNode
  plugins: Record<K, Plugin>
  defaultPlugin: K
  initialState?: {
    plugin: string
    state?: unknown
  }
  changed?: (changed: boolean) => void
}
