import { put, select, takeEvery } from 'redux-saga/effects'

import { serializeDocument } from '../documents/reducer'
import { scopeSelector } from '../helpers'
import { SelectorReturnType } from '../types'
import { copy, CopyAction, pureCopy } from './actions'

export function* clipboardSaga() {
  yield takeEvery(copy.type, copySaga)
}

function* copySaga(action: CopyAction) {
  const document: SelectorReturnType<typeof serializeDocument> = yield select(
    scopeSelector(serializeDocument, action.scope),
    action.payload
  )
  if (!document) return
  yield put(pureCopy(document)(action.scope))
}
