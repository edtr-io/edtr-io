import * as R from 'ramda'

import { isDocumentIdentifier, SerializedDocument } from '../document'
import { isStatefulPlugin, Plugin } from '../plugin'

export enum ActionType {
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change',
  Focus = 'Focus',
  Undo = 'Undo',
  Redo = 'Redo',
  Persist = 'Persist',
  ResetHistory = 'ResetHistory'
}
export enum ActionCommitType {
  ForceCommit = 'ForceCommit'
}

export function reducer(state: BaseState | State, action: Action): State {
  if (!hasHistory(state)) {
    return reducer(
      {
        ...state,
        history: {
          initialState: state,
          actions: [],
          redoStack: [],
          pending: 0
        }
      },
      action
    )
  }

  switch (action.type) {
    case ActionType.Insert:
      return handleInsert(state, action)
    case ActionType.Remove:
      return handleRemove(state, action)
    case ActionType.Change:
      return handleChange(state, action)
    case ActionType.Focus:
      return handleFocus(state, action)
    case ActionType.Undo:
      return handleUndo(state)
    case ActionType.Redo:
      return handleRedo(state)
    case ActionType.Persist:
      return handlePersist(state)
    case ActionType.ResetHistory:
      return handleResetHistory(state)
  }
}

let debounceTimeout: NodeJS.Timeout | null = null
function commit(state: State, action: Undoable): State['history'] {
  if (action.commit !== ActionCommitType.ForceCommit) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      const latestAction = R.last(R.last(state.history.actions) || [])
      if (
        latestAction &&
        latestAction.commit !== ActionCommitType.ForceCommit
      ) {
        debounceTimeout = setTimeout(() => {
          debounceTimeout = null
        }, 1000)
        return {
          initialState: state.history.initialState,
          // @ts-ignore
          actions: R.adjust(-1, R.append(action), state.history.actions),
          redoStack: [],
          pending: state.history.pending + 1
        }
      }
    }
  }

  // restart timeout
  debounceTimeout = setTimeout(() => {
    debounceTimeout = null
  }, 1000)
  // forced commit or timeout
  return {
    initialState: state.history.initialState,
    actions: R.append([action], state.history.actions),
    redoStack: [],
    pending: state.history.pending + 1
  }
}

function handleInsert(state: State, action: InsertAction) {
  const type = action.payload.plugin || getDefaultPlugin(state)
  const id = action.payload.id

  const plugin = getPlugin(state, type)

  let pluginState
  if (plugin && isStatefulPlugin(plugin)) {
    pluginState = action.payload.state
  }

  const history = commit(state, action)
  return {
    ...state,
    focus: id,
    documents: {
      ...state.documents,
      [id]: {
        plugin: type,
        state: pluginState
      }
    },
    history
  }
}

function handleRemove(state: State, action: RemoveAction): State {
  const history = commit(state, action)
  return {
    ...state,
    documents: R.omit([action.payload], state.documents),
    history
  }
}

function handleChange(state: State, action: ChangeAction): State {
  const { id, state: stateHandler } = action.payload

  if (!state.documents[id]) {
    //TODO: console.warn: Missing Id
    return state
  }
  const history = commit(state, action)

  return {
    ...state,
    documents: {
      ...state.documents,
      [id]: {
        ...state.documents[id],
        state: stateHandler(state.documents[id].state)
      }
    },
    history
  }
}

function handleFocus(state: State, action: FocusAction): State {
  return {
    ...state,
    focus: action.payload
  }
}

function handleUndo(state: State): State {
  const undoing = R.last(state.history.actions)
  if (undoing) {
    return {
      ...state,
      documents: R.reduce(
        (tempState: BaseState | State, actions: Undoable[]) => {
          return R.reduce(reducer, tempState, actions)
        },
        state.history.initialState,
        R.dropLast(1, state.history.actions)
      ).documents,
      history: {
        initialState: state.history.initialState,
        actions: R.dropLast(1, state.history.actions),
        redoStack: R.append(undoing, state.history.redoStack),
        pending: state.history.pending - undoing.length
      }
    }
  } else if (hasHistory(state.history.initialState)) {
    const undoOld = handleUndo(state.history.initialState)
    return {
      ...undoOld,
      history: {
        ...undoOld.history,
        redoStack: R.concat(state.history.redoStack, undoOld.history.redoStack)
      }
    }
  }

  return state
}

function handleRedo(state: State): State {
  const redoing = R.last(state.history.redoStack)
  if (redoing) {
    debounceTimeout = null
    const nextState = R.reduce(reducer, state, redoing)
    debounceTimeout = null
    return {
      ...nextState,
      history: {
        ...nextState.history,
        redoStack: R.dropLast(1, state.history.redoStack)
      }
    }
  }

  return state
}

function handlePersist(state: State): State {
  return {
    ...state,
    history: {
      ...state.history,
      pending: 0
    }
  }
}

function handleResetHistory(state: State): State {
  return {
    ...state,
    history: {
      initialState: {
        defaultPlugin: state.defaultPlugin,
        plugins: state.plugins,
        documents: state.documents,
        focus: state.focus
      },
      actions: [],
      redoStack: [],
      pending: 0
    }
  }
}
export interface BaseState {
  defaultPlugin: PluginType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: Record<PluginType, Plugin<any>>
  documents: Record<string, PluginState>
  focus?: string
}

export interface State extends BaseState {
  history: {
    initialState: BaseState | State
    actions: Undoable[][]
    redoStack: Undoable[][]
    pending: number
  }
}

export function hasHistory(state: BaseState | State): state is State {
  return (state as State).history !== undefined
}

export type Undoable = (InsertAction | ChangeAction | RemoveAction) & {
  commit?: ActionCommitType
}
export type Action =
  | Undoable
  | FocusAction
  | UndoAction
  | RedoAction
  | PersistAction
  | ResetHistoryAction

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

export interface RedoAction {
  type: ActionType.Redo
}

export interface PersistAction {
  type: ActionType.Persist
}

export interface ResetHistoryAction {
  type: ActionType.ResetHistory
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

export function hasPendingChanges(state: State): boolean {
  return state.history.pending !== 0
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
