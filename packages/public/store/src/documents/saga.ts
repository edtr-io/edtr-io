/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StoreDeserializeHelpers,
  Updater
} from '@edtr-io/internal__plugin-state'
import { channel, Channel } from 'redux-saga'
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'

import { ReversibleAction } from '../actions'
import { scopeSelector } from '../helpers'
import { commit, tempCommit } from '../history/actions'
import { getPluginOrDefault, getPluginTypeOrDefault } from '../plugins/reducer'
import { ReturnTypeFromSelector } from '../types'
import {
  change,
  ChangeAction,
  pureChange,
  insert,
  InsertAction,
  pureInsert,
  pureRemove,
  remove,
  RemoveAction,
  PureChangeAction
} from './actions'
import { getDocument } from './reducer'

export function* documentsSaga() {
  yield all([
    takeEvery(insert.type, insertSaga),
    takeEvery(change.type, changeSaga),
    takeEvery(remove.type, removeSaga)
  ])
}

function* removeSaga(action: RemoveAction) {
  const id = action.payload
  const doc: ReturnTypeFromSelector<typeof getDocument> = yield select(
    scopeSelector(getDocument, action.scope),
    id
  )
  if (!doc) return

  const actions: ReversibleAction[] = [
    {
      action: pureRemove(id)(action.scope),
      reverse: pureInsert({
        id,
        plugin: doc.plugin,
        state: doc.state
      })(action.scope)
    }
  ]
  yield put(commit(actions)(action.scope))
}

function* insertSaga(action: InsertAction) {
  const initialState = action.payload
  const [actions]: [ReversibleAction[], unknown] = yield call(
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

  const [actions, state]: [ReversibleAction[], unknown] = yield call(
    handleRecursiveInserts,
    action.scope,
    (helpers: StoreDeserializeHelpers) => {
      return stateHandler.immediate(document.state, helpers)
    }
  )

  function createChange(
    previousState: unknown,
    newState: unknown
  ): ReversibleAction<PureChangeAction, PureChangeAction> {
    return {
      action: pureChange({ id, state: newState })(action.scope),
      reverse: pureChange({ id, state: previousState })(action.scope)
    }
  }

  actions.push(createChange(document.state, state))

  if (!stateHandler.resolver) {
    yield put(commit(actions)(action.scope))
  } else {
    // async change, handle with stateHandler.resolver

    const chan: Channel<ChannelAction> = yield call(channel)

    yield put(
      tempCommit({
        immediate: actions,
        resolver: (resolve, reject, next) => {
          if (!stateHandler.resolver) {
            resolve(actions)
            return
          }

          stateHandler.resolver(
            function stateResolve(updater) {
              chan.put({
                resolve: updater,
                scope: action.scope,
                callback: (resolveActions, pureResolveState) => {
                  resolve([
                    ...resolveActions,
                    createChange(document.state, pureResolveState)
                  ])
                }
              })
            },
            function stateReject(updater) {
              chan.put({
                reject: updater,
                scope: action.scope,
                callback: (resolveActions, pureResolveState) => {
                  reject([
                    ...resolveActions,
                    createChange(document.state, pureResolveState)
                  ])
                }
              })
            },
            function stateNext(updater) {
              chan.put({
                next: updater,
                scope: action.scope,
                callback: (resolveActions, pureResolveState) => {
                  next([
                    ...resolveActions,
                    createChange(document.state, pureResolveState)
                  ])
                }
              })
            }
          )
        }
      })(action.scope)
    )

    while (true) {
      const payload: ChannelAction = yield take(chan)

      const currentDocument: ReturnTypeFromSelector<
        typeof getDocument
      > = yield select(scopeSelector(getDocument, action.scope), id)
      if (!currentDocument) continue

      const updater =
        payload.resolve || payload.next || payload.reject || (s => s)

      const [resolveActions, pureResolveState]: [
        ReversibleAction[],
        unknown
      ] = yield call(
        handleRecursiveInserts,
        action.scope,
        (helpers: StoreDeserializeHelpers) => {
          return updater(currentDocument.state, helpers)
        }
      )
      payload.callback(resolveActions, pureResolveState)
      if (payload.resolve || payload.reject) {
        break
      }
    }
  }
}

interface ChannelAction {
  resolve?: Updater<unknown>
  next?: Updater<unknown>
  reject?: Updater<unknown>
  scope: string
  callback: (actions: ReversibleAction[], pureState: unknown) => void
}

export function* handleRecursiveInserts(
  scope: string,
  act: (helpers: StoreDeserializeHelpers) => unknown,
  initialDocuments: { id: string; plugin?: string; state?: unknown }[] = []
) {
  const actions: ReversibleAction[] = []
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
    if (doc.state === undefined) {
      pluginState = plugin.state.createInitialState(helpers)
    } else {
      pluginState = plugin.state.deserialize(doc.state, helpers)
    }

    const pluginType: ReturnTypeFromSelector<
      typeof getPluginTypeOrDefault
    > = yield select(scopeSelector(getPluginTypeOrDefault, scope), doc.plugin)
    // we could, but don't need to reverse inserts.
    actions.push({
      action: pureInsert({
        id: doc.id,
        plugin: pluginType,
        state: pluginState
      })(scope),
      reverse: pureRemove(doc.id)(scope)
    })
  }
  return [actions, result]
}
