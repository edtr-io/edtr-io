import { all, put, select, takeEvery } from 'redux-saga/effects'
import {
  ActionType,
  EffectfulChangeAction,
  AsyncInsertAction,
  ChangeAction,
  InitRootAction,
  InsertAction
} from './actions'
import { StoreDeserializeHelpers } from '../plugin-state'
import { getPluginOrDefault, getPluginTypeOrDefault } from './selectors'
import { AsyncState, isStatefulPlugin } from '../plugin'
import { State } from '@edtr-io/core'

function* asyncInsertAction(action: AsyncInsertAction) {
  let immediateState = undefined
  if (action.payload.state) {
    immediateState = action.payload.state.immediateState
  }
  const immediateInsert: InsertAction = {
    type: ActionType.Insert,
    payload: {
      id: action.payload.id,
      plugin: action.payload.plugin,
      state: immediateState
    }
  }
  yield put(immediateInsert)

  if (action.payload.state && action.payload.state.asyncState) {
    const resolvedAsyncState = yield action.payload.state.asyncState
    const insertAsyncState: InsertAction = {
      type: ActionType.Insert,
      payload: {
        id: action.payload.id,
        plugin: action.payload.plugin,
        state: resolvedAsyncState
      }
    }
    yield put(insertAsyncState)
  }
}

function* effectfulChangeAction(action: EffectfulChangeAction) {
  const payload = yield action.payload

  //resolve insert sideeffects first
  const state = yield select(state => state)
  let pendingDocs: { id: string; plugin?: string; state?: unknown }[] = []
  let helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }
  const document = state.documents[payload.id]
  const pluginState = payload.state(document.state, helpers)
  const inserts = handleRecursiveInserts(state, pendingDocs)
  for (let insert of inserts) {
    yield asyncInsertAction(insert)
  }
  const change: ChangeAction = {
    type: ActionType.Change,
    payload: {
      id: payload.id,
      state: () => pluginState
    }
  }

  yield put(change)
}

function* initRootAction(action: InitRootAction) {
  const initialState = action.payload
  const state = yield select(state => state)
  const inserts = handleRecursiveInserts(state, [
    {
      ...initialState,
      id: 'root'
    }
  ])
  for (let insert of inserts) {
    yield asyncInsertAction(insert)
  }
}

export function* watchInsertAction() {
  yield takeEvery(ActionType.AsyncInsert, asyncInsertAction)
}
export function* watchChangeAction() {
  yield takeEvery(ActionType.EffectfulChange, effectfulChangeAction)
}
export function* watchInitRootAction() {
  yield takeEvery(ActionType.InitRoot, initRootAction)
}

export function* rootSaga() {
  yield all([watchInsertAction(), watchChangeAction(), watchInitRootAction()])
}

function handleRecursiveInserts(
  state: State,
  docs: {
    id: string
    plugin?: string
    state?: unknown
  }[]
): AsyncInsertAction[] {
  let pendingDocs = docs
  const actions: AsyncInsertAction[] = []

  let helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }

  while (pendingDocs.length > 0) {
    const doc = pendingDocs.pop()
    if (!doc) {
      return []
    }

    const plugin = getPluginOrDefault(state, doc.plugin)
    if (!plugin) {
      // TODO: Plugin does not exist
      return []
    }

    let pluginState: AsyncState | undefined = undefined
    if (isStatefulPlugin(plugin)) {
      if (doc.state === undefined) {
        pluginState = plugin.state.createInitialState(helpers)
      } else {
        pluginState = {
          immediateState: plugin.state.deserialize(doc.state, helpers)
        }
      }
    }

    actions.push({
      type: ActionType.AsyncInsert,
      payload: {
        id: doc.id,
        plugin: getPluginTypeOrDefault(state, doc.plugin),
        state: pluginState
      }
    })
  }

  return actions
}
