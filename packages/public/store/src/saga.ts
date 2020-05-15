import { all, call } from 'redux-saga/effects'

import { clipboardSaga } from './clipboard/saga'
import { documentsSaga } from './documents/saga'
import { historySaga } from './history/saga'
import { pluginSaga } from './plugin/saga'
import { rootSaga } from './root/saga'

export function* saga() {
  yield all([
    call(clipboardSaga),
    call(documentsSaga),
    call(historySaga),
    call(pluginSaga),
    call(rootSaga),
  ])
}
