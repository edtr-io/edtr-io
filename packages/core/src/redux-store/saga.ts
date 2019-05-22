import { all, call } from 'redux-saga/effects'

import { clipboardSaga } from './clipboard/saga'
import { documentsSaga } from './documents/saga'
import { rootSaga } from './root/saga'

export function* saga() {
  yield all([call(clipboardSaga), call(documentsSaga), call(rootSaga)])
}
