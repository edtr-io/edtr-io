/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as R from 'ramda'
import {
  all,
  call,
  delay,
  put,
  race,
  select,
  take,
  takeEvery
} from 'redux-saga/effects'

import { Action, setPartialState } from '../actions'
import { scopeSelector } from '../helpers'
import { ReturnTypeFromSelector } from '../types'
import {
  undo,
  redo,
  pureUndo,
  pureRedo,
  commit,
  pureCommit,
  reset,
  pureReset,
  UndoAction,
  RedoAction,
  ResetAction
} from './actions'
import {
  getInitialState,
  getPendingChanges,
  getRedoStack,
  getUndoStack
} from './reducer'

export function* historySaga() {
  yield all([
    call(commitSaga),
    takeEvery(undo.type, undoSaga),
    takeEvery(redo.type, redoSaga),
    takeEvery(reset.type, resetSaga)
  ])
}

function* commitSaga() {
  while (true) {
    const action = yield take(commit.type)
    yield call(executeCommit, action.payload, false, action.scope)

    while (true) {
      const { action, timeout } = yield race({
        action: take(commit.type),
        timeout: delay(1000)
      })

      if (timeout) {
        break
      }

      if (action) {
        yield call(executeCommit, action.payload, true, action.scope)
      }
    }
  }
}

function* executeCommit(actions: Action[], combine: boolean, scope: string) {
  yield all(actions.map(action => put(action)))
  yield put(
    pureCommit({
      combine,
      actions
    })(scope)
  )
}

function* undoSaga(action: UndoAction) {
  const undoStack: ReturnTypeFromSelector<typeof getUndoStack> = yield select(
    scopeSelector(getUndoStack, action.scope)
  )
  const replay = R.tail(undoStack)

  // Revert state to last computed state
  const { documents, focus } = yield select(
    scopeSelector(getInitialState, action.scope)
  )
  yield put(setPartialState({ documents, focus })(action.scope))

  // Replay all except last commit
  yield all(
    R.reverse(replay).map(actions => {
      return all(actions.map(action => put(action)))
    })
  )
  yield put(pureUndo()(action.scope))
}

function* redoSaga(action: RedoAction) {
  const redoStack: ReturnTypeFromSelector<typeof getRedoStack> = yield select(
    scopeSelector(getRedoStack, action.scope)
  )
  const replay = R.head(redoStack)
  if (!replay) return
  yield all(replay.map(action => put(action)))
  yield put(pureRedo()(action.scope))
}

function* resetSaga(action: ResetAction) {
  while (true) {
    const pendingChanges: ReturnTypeFromSelector<
      typeof getPendingChanges
    > = yield select(scopeSelector(getPendingChanges, action.scope))
    if (pendingChanges === 0) break
    else if (pendingChanges < 0) {
      yield call(redoSaga, redo()(action.scope))
    } else {
      yield call(undoSaga, undo()(action.scope))
    }
  }
  yield put(pureReset()(action.scope))
}
