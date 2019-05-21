import { put, takeEvery } from 'redux-saga/effects'

import { insert } from '../documents/actions'
import { InitRootAction, initRoot } from './actions'

export function* rootSaga() {
  yield takeEvery(initRoot.type, initRootSaga)
}

function* initRootSaga(action: InitRootAction) {
  yield put(insert({ id: 'root', ...action.payload }))
}
