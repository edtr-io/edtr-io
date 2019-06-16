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
import {
  undo,
  redo,
  pureUndo,
  pureRedo,
  commit,
  pureCommit,
  reset,
  pureReset
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
    yield call(executeCommit, action.payload, false)

    while (true) {
      const { action, timeout } = yield race({
        action: take(commit.type),
        timeout: delay(1000)
      })

      if (timeout) {
        break
      }

      if (action) {
        yield call(executeCommit, action.payload, true)
      }
    }
  }
}

function* executeCommit(actions: Action[], combine: boolean) {
  yield all(actions.map(action => put(action)))
  yield put(
    pureCommit({
      combine,
      actions
    })
  )
}

function* undoSaga() {
  const undoStack: ReturnType<typeof getUndoStack> = yield select(getUndoStack)
  const replay = R.tail(undoStack)

  // Revert state to last computed state
  const { documents, focus } = yield select(getInitialState)
  yield put(setPartialState({ documents, focus }))

  // Replay all except last commit
  yield all(
    replay.map(actions => {
      return all(actions.map(action => put(action)))
    })
  )
  yield put(pureUndo())
}

function* redoSaga() {
  const redoStack: ReturnType<typeof getRedoStack> = yield select(getRedoStack)
  const replay = R.head(redoStack)
  if (!replay) return
  yield all(replay.map(action => put(action)))
  yield put(pureRedo())
}

function* resetSaga() {
  while (true) {
    const pendingChanges: ReturnType<typeof getPendingChanges> = yield select(
      getPendingChanges
    )
    if (pendingChanges === 0) break
    const saga = pendingChanges < 0 ? redoSaga : undoSaga
    yield call(saga)
  }
  yield put(pureReset())
}
