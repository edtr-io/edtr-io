/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { isStatefulPlugin } from '@edtr-io/internal__plugin'
import { StoreDeserializeHelpers } from '@edtr-io/internal__plugin-state'
import { all, call, put, select, takeEvery } from 'redux-saga/effects'

import { Action } from '../actions'
import { scopeSelector } from '../helpers'
import { commit } from '../history/actions'
import { getPluginOrDefault, getPluginTypeOrDefault } from '../plugins/reducer'
import { ReturnTypeFromSelector } from '../types'
import {
  change,
  ChangeAction,
  pureChange,
  insert,
  InsertAction,
  pureInsert
} from './actions'
import { getDocument } from './reducer'

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
  yield put(commit(actions)(action.scope))
}

function* changeSaga(action: ChangeAction) {
  const { id, state: stateHandler } = action.payload
  const document: ReturnTypeFromSelector<typeof getDocument> = yield select(
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
    pureChange({
      id,
      state
    })(action.scope)
  )
  yield put(commit(actions)(action.scope))
}

export function* handleRecursiveInserts(
  scope: string,
  act: (helpers: StoreDeserializeHelpers) => unknown,
  initialDocuments: { id: string; plugin?: string; state?: unknown }[] = []
) {
  const actions: Action[] = []
  const pendingDocs: {
    id: string
    plugin?: string
    state?: unknown
  }[] = initialDocuments
  const helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }
  const result = act(helpers)
  while (pendingDocs.length > 0) {
    const doc = pendingDocs.pop()
    if (!doc) return
    const plugin: ReturnTypeFromSelector<
      typeof getPluginOrDefault
    > = yield select(scopeSelector(getPluginOrDefault, scope), doc.plugin)
    if (!plugin) return

    let pluginState: unknown
    if (isStatefulPlugin(plugin)) {
      if (doc.state === undefined) {
        pluginState = plugin.state.createInitialState(helpers)
      } else {
        pluginState = plugin.state.deserialize(doc.state, helpers)
      }
    }

    const pluginType: ReturnTypeFromSelector<
      typeof getPluginTypeOrDefault
    > = yield select(scopeSelector(getPluginTypeOrDefault, scope), doc.plugin)
    actions.push(
      pureInsert({
        id: doc.id,
        plugin: pluginType,
        state: pluginState
      })(scope)
    )
  }
  return [actions, result]
}
