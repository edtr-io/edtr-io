import * as R from 'ramda'

import { Action } from '../actions'
import { createSubReducer } from '../helpers'
import { State } from '../types'
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

import { getDocuments } from '../documents/reducer'

export const historyReducer = createSubReducer(
  'history',
  {
    undoStack: [],
    redoStack: [],
    pendingChanges: 0
  },
  {
    [persist.type](historyState, _action: PersistAction, state) {
      if (!state) return historyState
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

      if (combine) {
        const { undoStack } = historyState
        const previousActions = (R.head(undoStack) || []) as unknown[]
        actionsToCommit = [...previousActions, ...actionsToCommit]
      }

      return {
        ...historyState,
        undoStack: [actionsToCommit, ...historyState.undoStack],
        redoStack: [],
        pendingChanges: historyState.pendingChanges + actions.length
      }
    },
    [pureUndo.type](historyState, _action: PureUndoAction) {
      const { undoStack } = historyState
      const actions = R.head(undoStack) as Action[]

      if (actions) {
        return {
          ...historyState,
          undoStack: R.tail(undoStack) as unknown[][],
          redoStack: [actions, ...historyState.redoStack],
          pendingChanges: historyState.pendingChanges - actions.length
        }
      }

      return historyState
    },
    [pureRedo.type](historyState, _action: PureRedoAction) {
      const [actions, ...remainingRedoStack] = historyState.undoStack

      return {
        ...historyState,
        undoStack: [actions, ...historyState.undoStack],
        redoStack: remainingRedoStack,
        pendingChanges: historyState.pendingChanges + actions.length
      }
    }
  }
)

export function getHistory(state: State) {
  return state.history
}

export function getInitialState(state: State) {
  return getHistory(state).initialState
}

export function getPendingChanges(state: State) {
  return getHistory(state).pendingChanges
}

export function hasPendingChanges(state: State) {
  return getPendingChanges(state) !== 0
}

export function getUndoStack(state: State) {
  return getHistory(state).undoStack as Action[][]
}

export function getRedoStack(state: State) {
  return getHistory(state).redoStack as Action[][]
}
// TODO: handle reset
// TODO: handle persist
