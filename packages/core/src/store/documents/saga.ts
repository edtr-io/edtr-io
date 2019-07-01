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
import { scopeSelector } from '../helpers'

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
    action.scope,
    () => {},
    [initialState]
  )
  yield put(commit(action.scope)(actions))
}

function* changeSaga(action: ChangeAction) {
  const { id, state: stateHandler } = action.payload
  const document: ReturnType<typeof getDocument> = yield select(
    scopeSelector(getDocument, action.scope),
    id
  )
  if (!document) return

  const [actions, state]: [Action[], unknown] = yield call(
    handleRecursiveInserts,
    action.scope,
    (helpers: StoreDeserializeHelpers) => {
      return stateHandler(document.state, helpers)
    }
  )
  actions.push(
    pureChange(action.scope)({
      id,
      state
    })
  )
  yield put(commit(action.scope)(actions))
}

export function* handleRecursiveInserts(
  scope: string,
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
      scopeSelector(getPluginOrDefault, scope),
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
      scopeSelector(getPluginTypeOrDefault, scope),
      doc.plugin
    )
    actions.push(
      pureInsert(scope)({
        id: doc.id,
        plugin: pluginType,
        state: pluginState
      })
    )
  }
  return [actions, result]
}
