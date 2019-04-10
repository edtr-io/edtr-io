import * as R from 'ramda'

import { State } from './reducer'
import { Undoable } from './actions'
import { hasHistory } from './selectors'

export enum ActionCommitType {
  ForceCommit = 'ForceCommit',
  ForceCombine = 'ForceCombine'
}

export function commitAsIs(
  state: State,
  actions: Undoable[]
): State['history'] {
  return {
    ...state.history,
    actions: R.append(actions, state.history.actions),
    redoStack: [],
    pending: state.history.pending + actions.length
  }
}

let debounceTimeout: number | null = null
export function commit(state: State, action: Undoable): State['history'] {
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
