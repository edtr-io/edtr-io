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
import { undo, redo, pureUndo, pureRedo, commit, pureCommit } from './actions'
import { getInitialState, getRedoStack, getUndoStack } from './reducer'

export function* historySaga() {
  yield all([
    call(commitSaga),
    // takeEvery(commit.type, commitSaga),
    takeEvery(undo.type, undoSaga),
    takeEvery(redo.type, redoSaga)
  ])
}

function* commitSaga() {
  while (true) {
    const action = yield take(commit.type)
    yield call(executeCommit, action.payload, false)

    do {
      const { action } = yield race({
        action: take(commit.type),
        timeout: delay(1000)
      })

      if (action) {
        yield call(executeCommit, action.payload, true)
      }
    } while (action)
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
