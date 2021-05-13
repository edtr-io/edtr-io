import { all, call, put, takeEvery } from 'redux-saga/effects'

import { ReversibleAction, setPartialState } from '../actions'
import { handleRecursiveInserts } from '../documents/saga'
import { persist } from '../history/actions'
import { InitRootAction, initRoot, pureInitRoot } from './actions'

export function* rootSaga() {
  yield takeEvery(initRoot.type, initRootSaga)
}

function* initRootSaga(action: InitRootAction) {
  yield put(
    setPartialState({
      plugins: action.payload.plugins,
    })(action.scope)
  )
  yield put(pureInitRoot()(action.scope))
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [actions]: [ReversibleAction[], unknown] = yield call(
    handleRecursiveInserts,
    action.scope,
    () => {},
    [{ id: 'root', ...(action.payload.initialState || {}) }]
  )

  yield all(actions.map((reversible) => put(reversible.action)))
  yield put(persist()(action.scope))
}
