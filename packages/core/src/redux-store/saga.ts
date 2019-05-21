import { all, call } from 'redux-saga/effects'

import { documentsSaga } from './documents/saga'
import { rootSaga } from './root/saga'

export function* saga() {
  yield all([call(documentsSaga), call(rootSaga)])
}
