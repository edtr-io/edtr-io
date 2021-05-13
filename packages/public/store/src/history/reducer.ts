import * as R from 'ramda'

import { ReversibleAction } from '../actions'
import { getDocuments } from '../documents/reducer'
import {
  createInternalSelector,
  createSelector,
  createSubReducer,
  SubReducer,
} from '../helpers'
import { HistoryState, InternalSelector, Selector } from '../types'
import {
  persist,
  PersistAction,
  pureCommit,
  PureCommitAction,
  pureRedo,
  PureRedoAction,
  pureUndo,
  PureUndoAction,
} from './actions'

/** @internal */
export const historyReducer: SubReducer<HistoryState> = createSubReducer(
  'history',
  {
    undoStack: [],
    redoStack: [],
    pendingChanges: 0,
  },
  {
    [persist.type](historyState, _action: PersistAction, state) {
      return {
        ...historyState,
        initialState: historyState.initialState || {
          documents: getDocuments()(state),
        },
        pendingChanges: 0,
      }
    },
    [pureCommit.type](historyState, action: PureCommitAction) {
      const { combine, actions } = action.payload
      let actionsToCommit = actions
      const { undoStack } = historyState
      return {
        ...historyState,
        undoStack: calculateNewUndoStack(),
        redoStack: [],
        pendingChanges: historyState.pendingChanges + actions.length,
      }

      function calculateNewUndoStack() {
        if (combine && undoStack.length > 0) {
          const previousActions = undoStack[0]
          actionsToCommit = [...previousActions, ...actionsToCommit]
          return [actionsToCommit, ...R.tail(undoStack)]
        }

        return [actionsToCommit, ...undoStack]
      }
    },
    [pureUndo.type](historyState, _action: PureUndoAction) {
      const [actions, ...remainingUndoStack] = historyState.undoStack

      if (!actions) return historyState
      return {
        ...historyState,
        undoStack: remainingUndoStack,
        redoStack: [actions, ...historyState.redoStack],
        pendingChanges: historyState.pendingChanges - actions.length,
      }
    },
    [pureRedo.type](historyState, _action: PureRedoAction) {
      const [actions, ...remainingRedoStack] = historyState.redoStack

      if (!actions) return historyState
      return {
        ...historyState,
        undoStack: [actions, ...historyState.undoStack],
        redoStack: remainingRedoStack,
        pendingChanges: historyState.pendingChanges + actions.length,
      }
    },
  }
)

/** @internal */
export const getHistory: InternalSelector<HistoryState> =
  createInternalSelector((state) => state.history)

/** @public */
export const getPendingChanges: Selector<number> = createSelector(
  (state) => state.history.pendingChanges
)

/** @public */
export const hasPendingChanges: Selector<boolean> = createSelector(
  (state) => getPendingChanges()(state) !== 0
)

/** @public */
export const hasUndoActions: Selector<boolean> = createSelector(
  (state) => state.history.undoStack.length > 0
)

/** @public */
export const hasRedoActions: Selector<boolean> = createSelector(
  (state) => state.history.redoStack.length > 0
)

/** @internal */
export const getUndoStack: InternalSelector<ReversibleAction[][]> =
  createInternalSelector((state) => getHistory()(state).undoStack)
/** @internal */
export const getRedoStack: InternalSelector<ReversibleAction[][]> =
  createInternalSelector((state) => getHistory()(state).redoStack)
