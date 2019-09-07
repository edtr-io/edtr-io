import * as R from 'ramda'

import { Action } from '../actions'
import { getDocuments } from '../documents/reducer'
import { createSelector, createSubReducer } from '../helpers'
import {
  persist,
  PersistAction,
  pureCommit,
  PureCommitAction,
  pureRedo,
  PureRedoAction,
  pureUndo,
  PureUndoAction
} from './actions'

export const historyReducer = createSubReducer(
  'history',
  {
    undoStack: [],
    redoStack: [],
    pendingChanges: 0
  },
  {
    [persist.type](historyState, _action: PersistAction, state) {
      return {
        ...historyState,
        initialState: historyState.initialState || {
          documents: getDocuments()(state)
        },
        pendingChanges: 0
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
        pendingChanges: historyState.pendingChanges + actions.length
      }

      function calculateNewUndoStack() {
        if (combine && undoStack.length > 0) {
          const previousActions = R.head(undoStack)
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
        pendingChanges: historyState.pendingChanges - actions.length
      }
    },
    [pureRedo.type](historyState, _action: PureRedoAction) {
      const [actions, ...remainingRedoStack] = historyState.redoStack

      if (!actions) return historyState
      return {
        ...historyState,
        undoStack: [actions, ...historyState.undoStack],
        redoStack: remainingRedoStack,
        pendingChanges: historyState.pendingChanges + actions.length
      }
    }
  }
)

export const getHistory = createSelector(state => state.history)

export const getInitialState = createSelector(
  state => getHistory()(state).initialState
)

export const getPendingChanges = createSelector(
  state => getHistory()(state).pendingChanges
)

export const hasPendingChanges = createSelector(
  state => getPendingChanges()(state) !== 0
)

export const getUndoStack = createSelector(
  state => getHistory()(state).undoStack as Action[][]
)
export const getRedoStack = createSelector(
  state => getHistory()(state).redoStack as Action[][]
)
