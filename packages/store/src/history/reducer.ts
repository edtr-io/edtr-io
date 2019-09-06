import * as R from 'ramda'

import { Action } from '../actions'
import { getDocuments } from '../documents/reducer'
import { createSubReducer } from '../helpers'
import { ScopedState } from '../types'
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
          documents: getDocuments(state)
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

export function getHistory(state: ScopedState) {
  return state.history
}

export function getInitialState(state: ScopedState) {
  return getHistory(state).initialState
}

export function getPendingChanges(state: ScopedState) {
  return getHistory(state).pendingChanges
}

export function hasPendingChanges(state: ScopedState) {
  return getPendingChanges(state) !== 0
}

export function getUndoStack(state: ScopedState) {
  return getHistory(state).undoStack as Action[][]
}

export function getRedoStack(state: ScopedState) {
  return getHistory(state).redoStack as Action[][]
}
