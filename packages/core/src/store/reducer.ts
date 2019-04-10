import * as R from 'ramda'

import { getFocusTree, findNextNode, findPreviousNode } from './focus-tree'
import { isStatefulPlugin, isStatelessPlugin, Plugin } from '../plugin'
import { StoreSerializeHelpers, StoreDeserializeHelpers } from '../plugin-state'

export enum ActionType {
  InitRoot = 'InitRoot',
  Insert = 'Insert',
  Remove = 'Remove',
  Change = 'Change',
  Focus = 'Focus',
  FocusNext = 'FocusNext',
  FocusPrevious = 'FocusPrevious',
  Undo = 'Undo',
  Redo = 'Redo',
  Persist = 'Persist',
  Reset = 'Reset',
  CopyToClipboard = 'CopyToClipboard',
  SwitchEditable = 'SwitchEditable',

  AsyncChange = 'AsyncChange'
}
export enum ActionCommitType {
  ForceCommit = 'ForceCommit',
  ForceCombine = 'ForceCombine'
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
      return handleInitRoot(state, action)
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

function commitAsIs(state: State, actions: Undoable[]): State['history'] {
  return {
    ...state.history,
    actions: R.append(actions, state.history.actions),
    redoStack: [],
    pending: state.history.pending + actions.length
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

export function handleChange(state: State, action: ChangeAction): State {
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
  const inserts = handleRecursiveInserts(state, pendingDocs)
  const newState = inserts.reduce((currentState, action) => {
    return reducer(currentState, action)
  }, state)

  const history = inserts.length
    ? commitAsIs(state, [
        ...inserts,
        {
          type: ActionType.Change,
          payload: {
            id,
            state: () => pluginState
          }
        }
      ])
    : commit(state, action)
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
): InsertAction[] {
  let pendingDocs = docs
  const actions: InsertAction[] = []

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
  | FocusNextAction
  | FocusPreviousAction
  | UndoAction
  | RedoAction
  | PersistAction
  | ResetAction
  | CopyAction
  | SwitchEditableAction

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

export interface AsyncChangeAction<S = unknown> {
  type: ActionType.AsyncChange
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

export interface FocusNextAction {
  type: ActionType.FocusNext
}

export interface FocusPreviousAction {
  type: ActionType.FocusPrevious
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

export interface ResetAction {
  type: ActionType.Reset
}

export interface CopyAction {
  type: ActionType.CopyToClipboard
  payload: string
}

export interface SwitchEditableAction {
  type: ActionType.SwitchEditable
  payload: boolean
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

export function getClipboard(state: State): PluginState[] {
  return state.clipboard
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

export function isEditable(state: State): boolean {
  return state.editable
}

export function hasPendingChanges(state: State): boolean {
  return state.history.pending !== 0
}
export function pendingChanges(state: State): number {
  return state.history.pending
}

export function serializePlugin(state: State, id: string): PluginState | null {
  const document = getDocument(state, id)

  if (!document) {
    return null
  }

  const plugin = getPlugin(state, document.plugin)

  if (!plugin) {
    return null
  }

  const serializeHelpers: StoreSerializeHelpers = {
    getDocument: (id: string) => serializePlugin(state, id)
  }
  return {
    plugin: document.plugin,
    ...(isStatelessPlugin(plugin)
      ? {}
      : { state: plugin.state.serialize(document.state, serializeHelpers) })
  }
}

export function serializeDocument(state: State): PluginState | null {
  const root = getRoot(state)

  return root ? serializePlugin(state, root) : null
}
