import * as R from 'ramda'

import { Action } from '../actions'
import { createSubReducer } from '../helpers'
import { EditorState, StoreState } from '../types'
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

import { publicGetDocuments } from '../documents/reducer'

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
          documents: publicGetDocuments(state)
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
          const previousActions = R.head(undoStack) as unknown[]
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

export function publicGetPendingChanges(state: EditorState) {
  return publicGetHistory(state).pendingChanges
}

export function publicHasPendingChanges(state: EditorState) {
  return publicGetPendingChanges(state) !== 0
}

export function publicGetHistory(state: EditorState) {
  return state.history
}

export function publicGetUndoStack(state: EditorState) {
  return publicGetHistory(state).undoStack as Action[][]
}

export function publicGetRedoStack(state: EditorState) {
  return publicGetHistory(state).redoStack as Action[][]
}

export function publicGetInitialState(state: EditorState) {
  return publicGetHistory(state).initialState
}

export function getPendingChanges(state: StoreState, scope: string) {
  return publicGetPendingChanges(state[scope])
}

export function hasPendingChanges(state: StoreState, scope: string) {
  return publicHasPendingChanges(state[scope])
}

export function getHistory(state: StoreState, scope: string) {
  return publicGetHistory(state[scope])
}

export function getInitialState(state: StoreState, scope: string) {
  return publicGetInitialState(state[scope])
}

export function getUndoStack(state: StoreState, scope: string) {
  return publicGetUndoStack(state[scope])
}

export function getRedoStack(state: StoreState, scope: string) {
  return publicGetRedoStack(state[scope])
}

export const publicHistorySelectors = {
  getPendingChanges: publicGetPendingChanges,
  hasPendingChanges: publicHasPendingChanges
}
