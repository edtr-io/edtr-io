/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { all, call, put, takeEvery } from 'redux-saga/effects'

import { Action, setPartialState } from '../actions'
import { handleRecursiveInserts } from '../documents/saga'
import { persist } from '../history/actions'
import { InitRootAction, initRoot, pureInitRoot } from './actions'

export function* rootSaga() {
  yield takeEvery(initRoot.type, initRootSaga)
}

function* initRootSaga(action: InitRootAction) {
  yield put(
    setPartialState({
      plugins: {
        plugins: action.payload.plugins,
        defaultPlugin: action.payload.defaultPlugin
      }
    })(action.scope)
  )
  yield put(pureInitRoot()(action.scope))
  const [actions]: [Action[], unknown] = yield call(
    handleRecursiveInserts,
    action.scope,
    () => {},
    [{ id: 'root', ...(action.payload.initialState || {}) }]
  )

  yield all(actions.map(action => put(action)))
  yield put(persist()(action.scope))
}
