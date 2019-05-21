import { put, takeEvery } from 'redux-saga/effects'

import { asyncInsert } from '../documents/actions'
import { InitRootAction, initRoot } from './actions'

export function* rootSaga() {
  yield takeEvery(initRoot.type, initRootSaga)
}

function* initRootSaga(action: InitRootAction) {
  yield put(asyncInsert({ id: 'root', ...action.payload }))
}
