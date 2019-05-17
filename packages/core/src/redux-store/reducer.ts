import * as A from './actions'
import { isStatefulPlugin, Plugin } from '../plugin'

/* Utils */
function createSubReducer<K extends keyof State>(
  key: K,
  initialState: State[K],
  actionsMap: CaseReducersMapObject<State[K]>
): SubReducer<State[K]> {
  return (subState = initialState, action, state) => {
    const caseReducer = actionsMap[action.type]
    return typeof caseReducer === 'function'
      ? caseReducer((state && state[key]) || initialState, action, state)
      : subState
  }
}

type SubReducer<S = unknown> = (
  subState: S | undefined,
  action: A.Action,
  state: State | undefined
) => S
export interface CaseReducersMapObject<S = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [actionType: string]: CaseReducer<S, any>
}
type CaseReducer<S = unknown, A extends A.Action = A.Action> = (
  subState: S,
  action: A,
  state: State | undefined
) => S

/* Mode */
const editableReducer = createSubReducer('editable', true, {
  [A.setEditable.type](_state, action: A.SetEditableAction) {
    return action.payload
  }
})
export const isEditable = (state: State) => state.editable

/* Plugins */
const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)
export function getDefaultPlugin(state: State) {
  return state.plugins.defaultPlugin
}
export function getPlugins(state: State) {
  return state.plugins.plugins
}
export function getPlugin(state: State, type: string): Plugin | null {
  const plugins = getPlugins(state)
  return plugins[type] || null
}
export function getPluginOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}

/* Documents */
const documentsReducer = createSubReducer(
  'documents',
  {},
  {
    [A.insert.type](state, action: A.InsertAction, s) {
      if (!s) {
        return state // FIXME: can we guarantee that this does indeed exist?? we should be able to! foo
      }
      const { plugin: type } = action.payload
      const plugin = getPluginOrDefault(s, type)

      // let pluginState
      if (plugin && isStatefulPlugin(plugin)) {
        // console.log(id, pluginState)
      }

      return state
    }
  }
)
export function getDocuments(state: State) {
  return state.documents
}

/* Focus */
const focusReducer = createSubReducer('focus', null, {})
export function getFocused(state: State) {
  return state.focus
}

/* Clipboard */
const clipboardReducer = createSubReducer('clipboard', [], {
  // [A.copy.type](state, action: A.CopyAction) {
  //   const maxLength = 3
  //   state.unshift(action.payload)
  //   state.splice(maxLength, state.length - maxLength)
  // }
})
export function getClipboard(state: State) {
  return state.clipboard
}

export function rootReducer(state: State | undefined, action: A.Action): State {
  return {
    editable: editableReducer(state && state.editable, action, state),
    documents: documentsReducer(state && state.documents, action, state),
    focus: focusReducer(state && state.focus, action, state),
    clipboard: clipboardReducer(state && state.clipboard, action, state),
    plugins: pluginsReducer(state && state.plugins, action, state)
  }
}

/* TODO History (containing Documents & Focus) */
export interface State {
  editable: boolean
  plugins: {
    defaultPlugin: string
    plugins: Record<string, Plugin>
  }
  documents: Record<string, DocumentState>
  focus: string | null
  clipboard: DocumentState[]
}

export interface DocumentState {
  plugin: string
  state?: unknown
}
