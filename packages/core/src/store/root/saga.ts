import { all, call, put, takeEvery } from 'redux-saga/effects'

import { InitRootAction, initRoot } from './actions'

import { handleRecursiveInserts } from '../documents/saga'
import { persist } from '../history/actions'
import { Action } from '../actions'

export function* rootSaga() {
  yield takeEvery(initRoot.type, initRootSaga)
}

function* initRootSaga(action: InitRootAction) {
  const [actions]: [Action[], unknown] = yield call(
    handleRecursiveInserts,
    () => {},
    [{ id: 'root', ...action.payload }]
  )

  yield all(actions.map(action => put(action)))
  yield put(persist())
}
