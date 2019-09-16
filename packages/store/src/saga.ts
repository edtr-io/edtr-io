/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { all, call } from 'redux-saga/effects'

import { clipboardSaga } from './clipboard/saga'
import { documentsSaga } from './documents/saga'
import { historySaga } from './history/saga'
import { rootSaga } from './root/saga'

export function* saga() {
  yield all([
    call(clipboardSaga),
    call(documentsSaga),
    call(historySaga),
    call(rootSaga)
  ])
}
