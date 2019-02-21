import { produce } from 'immer'
import * as R from 'ramda'

import { isDocumentIdentifier, SerializedDocument } from '../document'
import { isStatefulPlugin, Plugin } from '../plugin'

export enum ActionType {
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change',
  Focus = 'Focus',
  Undo = 'Undo'
}

export function reducer(state: State, action: Action): State {
  return produce(state, draft => {
    handleInsert()
    handleRemove()
    handleChange()
    handleFocus()
    handleUndo()

    function handleInsert() {
      if (action.type === ActionType.Insert) {
        const type = action.payload.plugin || getDefaultPlugin(draft)
        const id = action.payload.id

        const plugin = getPlugin(draft, type)

        let state
        if (plugin && isStatefulPlugin(plugin)) {
          state = action.payload.state
        }

        draft.focus = id
        draft.documents[id] = {
          plugin: type,
          state
        }
        save(action)
      }
    }

    function handleRemove() {
      if (action.type === ActionType.Remove) {
        delete draft.documents[action.payload]
        save(action)
      }
    }

    function handleChange() {
      if (action.type === ActionType.Change) {
        const { id, state } = action.payload

        if (!draft.documents[id]) {
          //TODO: console.warn: Missing Id
          return
        }

        draft.documents[id].state = state(draft.documents[id].state)
        save(action)
      }
    }

    function handleFocus() {
      if (action.type === ActionType.Focus) {
        draft.focus = action.payload
      }
    }

    function handleUndo() {
      if (action.type === ActionType.Undo && draft.history) {
        draft.history.actions.pop()
        draft.documents = R.reduce(
          (tempState: State, actions: Undoable[]) => {
            return R.reduce(reducer, tempState, actions)
          },
          draft.history.initialState,
          draft.history.actions
        ).documents
      }
    }

    function save(action: Undoable) {
      if (draft.history) {
        draft.history.actions.push([action])
      } else {
        draft.history = {
          initialState: state,
          actions: [[action]]
        }
      }
    }
  })
}

interface BaseState {
  defaultPlugin: PluginType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: Record<PluginType, Plugin<any>>
  documents: Record<string, PluginState>
  focus?: string
}

export interface State extends BaseState {
  history?: {
    initialState: BaseState
    actions: Undoable[][]
  }
}
export type Undoable = InsertAction | ChangeAction | RemoveAction
export type Action = Undoable | FocusAction | UndoAction

type PluginType = string

export interface InsertAction {
  type: ActionType.Insert
  payload: {
    id: string
  } & Partial<PluginState>
}

export interface ChangeAction<S = unknown> {
  type: ActionType.Change
  payload: {
    id: string
    state: (state: S) => S
  }
}

export interface RemoveAction {
  type: ActionType.Remove
  payload: string
}

export interface FocusAction {
  type: ActionType.Focus
  payload: string
}

export interface UndoAction {
  type: ActionType.Undo
}

export interface PluginState {
  plugin: PluginType
  state?: unknown
}

/** Selectors */
export function getDocuments(state: State): Record<string, PluginState> {
  return state.documents
}

export function getDocument(state: State, id: string): PluginState | null {
  return getDocuments(state)[id] || null
}

export function getPlugin(
  state: State,
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Plugin<any> | null {
  const plugins = getPlugins(state)

  return plugins[type] || null
}

export function getDefaultPlugin(state: State): PluginType {
  return state.defaultPlugin
}

export function getPlugins<K extends string = string>(
  state: State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<K, Plugin<any>> {
  return state.plugins
}

export function isFocused(state: State, id: string): boolean {
  return state.focus === id
}

export function serializeDocument(
  state: State,
  id: string
): SerializedDocument | null {
  const document = getDocument(state, id)

  if (!document) {
    return null
  }

  return {
    type: '@edtr-io/document',
    plugin: document.plugin,
    ...(document.state === undefined
      ? {}
      : { state: serializeState(document.state) })
  }

  function serializeState(
    pluginState: PluginState['state']
  ): PluginState['state'] {
    if (pluginState instanceof Object) {
      return R.map(
        (value: unknown) => {
          if (isDocumentIdentifier(value)) {
            return serializeDocument(state, value.id)
          }

          return serializeState(value)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pluginState as any
      )
    }

    return pluginState
  }
}
