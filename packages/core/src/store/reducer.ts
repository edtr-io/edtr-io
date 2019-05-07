import * as R from 'ramda'

import { findNextNode, findPreviousNode, getFocusTree } from './focus-tree'
import { isStatefulPlugin, Plugin, PluginState, PluginType } from '../plugin'
import {
  Action,
  ActionType,
  ChangeAction,
  CopyAction,
  FocusAction,
  FocusNextAction,
  FocusPreviousAction,
  InsertAction,
  RemoveAction,
  SwitchEditableAction,
  Undoable
} from './actions'
import {
  getPluginOrDefault,
  getPluginTypeOrDefault,
  hasHistory,
  hasPendingChanges
} from './selectors'
import { commit, commitAsIs } from './history'
import { serializePlugin } from './serializers'

export function reducer(
  state: BaseState | State | undefined,
  action: Action
): State {
  if (state === undefined) {
    throw new Error('State undefined. This should not happen')
  }
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
    case ActionType.InitRoot:
      return handleInitRoot(state)
    case ActionType.Insert:
      return handleInsert(state, action)
    case ActionType.Remove:
      return handleRemove(state, action)
    case ActionType.Change:
      return handleChange(state, action)
    case ActionType.Focus:
    case ActionType.FocusNext:
    case ActionType.FocusPrevious:
      return handleFocus(state, action)
    case ActionType.Undo:
      return handleUndo(state)
    case ActionType.Redo:
      return handleRedo(state)
    case ActionType.Persist:
      return handlePersist(state)
    case ActionType.Reset:
      return handleReset(state)
    case ActionType.CopyToClipboard:
      return handleCopyToClipboard(state, action)
    case ActionType.SwitchEditable:
      return handleSwitchEditable(state, action)
    default:
      return state
  }
}

function handleInsert(state: State, action: InsertAction) {
  const { id, plugin: type } = action.payload

  const plugin = getPluginOrDefault(state, type)

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
        plugin: getPluginTypeOrDefault(state, type),
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

export function handleChange(state: State, action: ChangeAction): State {
  const { id, state: stateHandler } = action.payload

  if (!state.documents[id]) {
    //TODO: console.warn: Missing Id
    return state
  }
  const history = commit(state, action)
  const pluginState = stateHandler(state.documents[id].state)
  return {
    ...state,
    documents: {
      ...state.documents,
      [id]: {
        ...state.documents[id],
        state: pluginState
      }
    },
    history
  }
}

function handleFocus(
  state: State,
  action: FocusAction | FocusNextAction | FocusPreviousAction
): State {
  if (action.type === ActionType.Focus) {
    return {
      ...state,
      focus: action.payload
    }
  }

  const from = state.focus
  if (!from) {
    return state
  }

  const root = getFocusTree(state)
  if (!root) {
    return state
  }

  const findNode =
    action.type === ActionType.FocusNext ? findNextNode : findPreviousNode
  const next = findNode(root, from)

  if (!next) {
    return state
  }

  return handleFocus(state, { type: ActionType.Focus, payload: next })
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
    const nextState = R.reduce(reducer, state, redoing)
    return {
      ...nextState,
      history: {
        ...commitAsIs(state, redoing),
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

function handleReset(state: State): State {
  let newState = state
  while (hasPendingChanges(newState)) {
    newState = handleUndo(newState)
  }
  return newState
}

function handleInitRoot(state: State): State {
  const newState = R.omit(['history', 'root'], state)
  return {
    ...newState,
    root: 'root',
    history: {
      initialState: newState,
      actions: [],
      redoStack: [],
      pending: 0
    }
  }
}

function handleCopyToClipboard(state: State, action: CopyAction): State {
  const serialized = serializePlugin(state, action.payload)
  if (!serialized) {
    return state
  }

  const maxLength = 3
  const appended = R.prepend(serialized, state.clipboard)
  const nextClipboard =
    appended.length > maxLength
      ? R.remove(maxLength, appended.length - maxLength, appended)
      : appended

  return {
    ...state,
    clipboard: nextClipboard
  }
}

function handleSwitchEditable(
  state: State,
  action: SwitchEditableAction
): State {
  return {
    ...state,
    editable: action.payload
  }
}

export interface BaseState {
  defaultPlugin: PluginType
  plugins: Record<PluginType, Plugin>
  documents: Record<string, PluginState>
  focus?: string
}

export interface State extends BaseState {
  root?: string
  history: {
    initialState: BaseState | State
    actions: Undoable[][]
    redoStack: Undoable[][]
    pending: number
  }
  clipboard: PluginState[]
  editable: boolean
}
export const createInitialState = <K extends string>(
  plugins: Record<K, Plugin>,
  defaultPlugin: K,
  editable: boolean
): State => {
  const initialState: BaseState = {
    plugins,
    defaultPlugin,
    documents: {}
  }
  return {
    ...initialState,
    history: {
      initialState,
      actions: [],
      redoStack: [],
      pending: 0
    },
    clipboard: [],
    editable: editable
  }
}
