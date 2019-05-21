import { all, call } from 'redux-saga/effects'

import { rootSaga } from './root/saga'

export function* saga() {
  yield all([call(rootSaga)])
}
