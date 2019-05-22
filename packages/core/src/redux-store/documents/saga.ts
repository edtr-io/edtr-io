import { put, select, takeEvery } from 'redux-saga/effects'

import { isStatefulPlugin } from '../../plugin'
import { StoreDeserializeHelpers } from '../../plugin-state'
import { insert, InsertAction, pureInsert } from './actions'

import { getPluginOrDefault, getPluginTypeOrDefault } from '../plugins/reducer'

export function* documentsSaga() {
  yield takeEvery(insert.type, asyncInsertSaga)
}

function* asyncInsertSaga(action: InsertAction) {
  const initialState = action.payload

  let pendingDocs: (typeof initialState)[] = [initialState]
  let helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }

  while (pendingDocs.length > 0) {
    const doc = pendingDocs.pop()

    if (!doc) {
      return
    }

    const plugin: ReturnType<typeof getPluginOrDefault> = yield select(
      getPluginOrDefault,
      doc.plugin
    )
    if (!plugin) {
      return
    }

    let pluginState: unknown
    if (isStatefulPlugin(plugin)) {
      if (doc.state === undefined) {
        pluginState = plugin.state.createInitialState(helpers)
      } else {
        pluginState = plugin.state.deserialize(doc.state, helpers)
      }
    }

    const pluginType: ReturnType<typeof getPluginTypeOrDefault> = yield select(
      getPluginTypeOrDefault,
      doc.plugin
    )
    yield put(
      pureInsert({
        id: doc.id,
        plugin: pluginType,
        state: pluginState
      })
    )
  }
}
