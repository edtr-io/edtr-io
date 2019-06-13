import { all, call, put, select, takeEvery } from 'redux-saga/effects'

import { isStatefulPlugin } from '../../plugin'
import { StoreDeserializeHelpers } from '../../plugin-state'
import {
  change,
  ChangeAction,
  pureChange,
  insert,
  InsertAction,
  pureInsert
} from './actions'
import { Action } from '../actions'
import { getDocument } from './reducer'

import { getPluginOrDefault, getPluginTypeOrDefault } from '../plugins/reducer'
import { commit } from '../history/actions'

export function* documentsSaga() {
  yield all([
    takeEvery(insert.type, insertSaga),
    takeEvery(change.type, changeSaga)
  ])
}

function* insertSaga(action: InsertAction) {
  const initialState = action.payload
  const [actions]: [Action[], unknown] = yield call(
    handleRecursiveInserts,
    () => {},
    [initialState]
  )
  yield put(commit(actions))
}

function* changeSaga(action: ChangeAction) {
  const { id, state: stateHandler } = action.payload
  const document: ReturnType<typeof getDocument> = yield select(getDocument, id)
  if (!document) return

  const [actions, state]: [Action[], unknown] = yield call(
    handleRecursiveInserts,
    (helpers: StoreDeserializeHelpers) => {
      return stateHandler(document.state, helpers)
    }
  )
  actions.push(
    pureChange({
      id,
      state
    })
  )
  yield put(commit(actions))
}

export function* handleRecursiveInserts(
  act: (helpers: StoreDeserializeHelpers) => unknown,
  initialDocuments: { id: string; plugin?: string; state?: unknown }[] = []
) {
  let actions: Action[] = []
  let pendingDocs: {
    id: string
    plugin?: string
    state?: unknown
  }[] = initialDocuments
  let helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }
  const result = act(helpers)
  while (pendingDocs.length > 0) {
    const doc = pendingDocs.pop()
    if (!doc) return
    const plugin: ReturnType<typeof getPluginOrDefault> = yield select(
      getPluginOrDefault,
      doc.plugin
    )
    if (!plugin) return

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
    actions.push(
      pureInsert({
        id: doc.id,
        plugin: pluginType,
        state: pluginState
      })
    )
  }
  return [actions, result]
}
