import { put, takeEvery, all } from 'redux-saga/effects'
import { ActionType, ChangeAction } from './reducer'

export function* asyncChangeAction(action: ChangeAction) {
  yield put({ type: ActionType.Change, payload: action.payload })
}

export function* watchAction() {
  yield takeEvery(ActionType.AsyncChange, asyncChangeAction)
}

export function* rootSaga() {
  yield all([watchAction()])
}
