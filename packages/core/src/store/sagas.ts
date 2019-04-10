import { put, takeEvery, all } from 'redux-saga/effects'
import { ActionType, AsyncChangeAction } from './actions'

export function* asyncChangeAction(action: AsyncChangeAction) {
  const payload = yield action.payload
  yield put({ type: ActionType.Change, payload: payload })
}

export function* watchAction() {
  yield takeEvery(ActionType.AsyncChange, asyncChangeAction)
}

export function* rootSaga() {
  yield all([watchAction()])
}
