import * as R from 'ramda'

import { isStatefulPlugin, isStatelessPlugin, Plugin } from '../plugin'
import { StoreSerializeHelpers, StoreDeserializeHelpers } from '../plugin-state'

export enum ActionType {
  InitRoot = 'InitRoot',
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change',
  Focus = 'Focus',
  Undo = 'Undo',
  Redo = 'Redo',
  Persist = 'Persist'
}
export enum ActionCommitType {
  ForceCommit = 'ForceCommit',
  ForceCombine = 'ForceCombine'
}

export const createInitialState = <K extends string>(
  plugins: Record<K, Plugin>,
  defaultPlugin: K
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
    }
  }
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
    case ActionType.InitRoot:
      return handleInitRoot(state, action)
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
  }
}

let debounceTimeout: number | null = null
function commit(state: State, action: Undoable): State['history'] {
  if (action.commit === ActionCommitType.ForceCombine) {
    if (state.history.actions.length) {
      return {
        ...state.history,
        // @ts-ignore
        actions: R.adjust(-1, R.append(action), state.history.actions),
        pending: state.history.pending + 1
      }
    } else if (
      hasHistory(state.history.initialState) &&
      state.history.initialState.history.actions.length
    ) {
      return {
        initialState: {
          ...state.history.initialState,
          history: {
            ...state.history.initialState.history,
            actions: R.adjust(
              // @ts-ignore
              -1,
              R.append(action),
              state.history.initialState.history.actions
            ),
            pending: state.history.pending + 1
          }
        },
        actions: [],
        redoStack: [],
        pending: state.history.pending + 1
      }
    }
  }

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

function handleChange(state: State, action: ChangeAction): State {
  const { id, state: stateHandler } = action.payload

  if (!state.documents[id]) {
    //TODO: console.warn: Missing Id
    return state
  }

  let pendingDocs: { id: string; plugin?: string; state?: unknown }[] = []
  let helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }
  const pluginState = stateHandler(state.documents[id].state, helpers)
  const actions = handleRecursiveInserts(state, pendingDocs)
  const newState = actions.reduce((currentState, action) => {
    return reducer(currentState, action)
  }, state)

  // TODO: we should commit action together with actions
  const history = commit(newState, action)

  return {
    ...newState,
    documents: {
      ...newState.documents,
      [id]: {
        ...newState.documents[id],
        state: pluginState
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

function handleInitRoot(state: State, action: InitRootAction): State {
  const initialState = action.payload
  const actions = handleRecursiveInserts(state, [
    {
      ...initialState,
      id: 'root'
    }
  ])

  const newState = actions.reduce((currentState, action) => {
    return reducer(currentState, action)
  }, state)

  delete newState.history
  delete newState.root

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

function handleRecursiveInserts(
  state: State,
  docs: {
    id: string
    plugin?: string
    state?: unknown
  }[]
): Action[] {
  let pendingDocs = docs
  const actions: Action[] = []

  let helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }

  while (pendingDocs.length > 0) {
    const doc = pendingDocs.pop()
    if (!doc) {
      return []
    }

    const plugin = getPluginOrDefault(state, doc.plugin)
    if (!plugin) {
      // TODO: Plugin does not exist
      return []
    }

    let pluginState: unknown
    if (isStatefulPlugin(plugin)) {
      if (doc.state === undefined) {
        pluginState = plugin.state.createInitialState(helpers)
      } else {
        pluginState = plugin.state.deserialize(doc.state, helpers)
      }
    }

    actions.push({
      type: ActionType.Insert,
      payload: {
        id: doc.id,
        plugin: getPluginTypeOrDefault(state, doc.plugin),
        state: pluginState
      }
    })
  }

  return actions
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
}

export function hasHistory(state: BaseState | State): state is State {
  return (state as State).history !== undefined
}

export type Undoable = (InsertAction | ChangeAction | RemoveAction) & {
  commit?: ActionCommitType
}
export type Action =
  | InitRootAction
  | Undoable
  | FocusAction
  | UndoAction
  | RedoAction
  | PersistAction

type PluginType = string

export interface InitRootAction {
  type: ActionType.InitRoot
  payload: {
    plugin?: string
    state?: unknown
  }
}

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
    state: (value: S, helpers: StoreDeserializeHelpers) => S
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

export interface PluginState {
  plugin: PluginType
  state?: unknown
}

/** Selectors */
export function getRoot(state: State) {
  return state.root
}

export function getDocuments(state: State): Record<string, PluginState> {
  return state.documents
}

export function getDocument(state: State, id: string): PluginState | null {
  return getDocuments(state)[id] || null
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

export function getDefaultPlugin(state: State): PluginType {
  return state.defaultPlugin
}

export function getPluginTypeOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): PluginType {
  return type
}

export function getPlugins<K extends string = string>(
  state: State
): Record<K, Plugin> {
  return state.plugins
}

export function isFocused(state: State, id: string): boolean {
  return state.focus === id
}

export function hasPendingChanges(state: State): boolean {
  return state.history.pending !== 0
}

export function serializeDocument(state: State): PluginState | null {
  const root = getRoot(state)

  return root ? _serializeDoc(state, root) : null

  function _serializeDoc(state: State, id: string): PluginState | null {
    const document = getDocument(state, id)

    if (!document) {
      return null
    }

    const plugin = getPlugin(state, document.plugin)

    if (!plugin) {
      return null
    }

    const serializeHelpers: StoreSerializeHelpers = {
      getDocument: (id: string) => getDocument(state, id)
    }
    return {
      plugin: document.plugin,
      ...(isStatelessPlugin(plugin)
        ? {}
        : { state: plugin.state.serialize(document.state, serializeHelpers) })
    }
  }
}
