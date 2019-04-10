import { put, takeEvery, all } from 'redux-saga/effects'
import { ActionType, AsyncInsertAction } from './actions'

export function* asyncInsertAction(action: AsyncInsertAction) {
  if (action.payload.tempState !== undefined) {
    yield put({
      type: ActionType.Insert,
      payload: {
        id: action.payload.id,
        plugin: action.payload.plugin,
        state: action.payload.tempState
      }
    })
  }

  let state = undefined
  if (action.payload.state !== undefined) {
    state = yield action.payload.state
  }
  yield put({
    type: ActionType.Insert,
    payload: {
      id: action.payload.id,
      plugin: action.payload.plugin,
      state: state
    }
  })
}

export function* watchAction() {
  yield takeEvery(ActionType.AsyncInsert, asyncInsertAction)
}

export function* rootSaga() {
  yield all([watchAction()])
}
