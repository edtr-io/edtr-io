import { invariant } from '@edtr-io/internal__dev-expression'
import {
  StoreDeserializeHelpers,
  StateUpdater
} from '@edtr-io/internal__plugin-state'
import { channel, Channel } from 'redux-saga'
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'
import generate from 'shortid'

import { ReversibleAction } from '../actions'
import { scopeSelector } from '../helpers'
import { commit, temporaryCommit } from '../history/actions'
import { getPlugin } from '../plugins/reducer'
import { SelectorReturnType } from '../types'
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
  PureChangeAction,
  wrap,
  WrapAction,
  pureWrap,
  PureWrapAction,
  unwrap,
  UnwrapAction,
  pureUnwrap,
  PureUnwrapAction,
  replace,
  ReplaceAction,
  PureReplaceAction,
  pureReplace
} from './actions'
import { getDocument } from './reducer'

export function* documentsSaga() {
  yield all([
    takeEvery(insert.type, insertSaga),
    takeEvery(remove.type, removeSaga),
    takeEvery(change.type, changeSaga),
    takeEvery(wrap.type, wrapSaga),
    takeEvery(unwrap.type, unwrapSaga),
    takeEvery(replace.type, replaceSaga)
  ])
}

function* insertSaga(action: InsertAction) {
  const initialState = action.payload
  const [actions]: [
    ReversibleAction[],
    unknown
  ] = yield call(handleRecursiveInserts, action.scope, () => {}, [initialState])
  yield put(commit(actions)(action.scope))
}

function* removeSaga(action: RemoveAction) {
  const id = action.payload
  const doc: SelectorReturnType<typeof getDocument> = yield select(
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

function* changeSaga(action: ChangeAction) {
  const { id, state: stateHandler } = action.payload
  const document: SelectorReturnType<typeof getDocument> = yield select(
    scopeSelector(getDocument, action.scope),
    id
  )
  if (!document) return

  const [actions, state]: [ReversibleAction[], unknown] = yield call(
    handleRecursiveInserts,
    action.scope,
    (helpers: StoreDeserializeHelpers) => {
      return stateHandler.initial(document.state, helpers)
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

  if (!stateHandler.executor) {
    yield put(commit(actions)(action.scope))
  } else {
    // async change, handle with stateHandler.resolver

    const chan: Channel<ChannelAction> = yield call(channel)

    yield put(
      temporaryCommit({
        initial: actions,
        executor: (resolve, reject, next) => {
          if (!stateHandler.executor) {
            resolve(actions)
            return
          }

          stateHandler.executor(
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

      const currentDocument: SelectorReturnType<typeof getDocument> = yield select(
        scopeSelector(getDocument, action.scope),
        id
      )
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

function* wrapSaga(action: WrapAction) {
  const { id, document: documentHandler } = action.payload
  const currentDocument: SelectorReturnType<typeof getDocument> = yield select(
    scopeSelector(getDocument, action.scope),
    id
  )
  const newId = generate()
  if (!currentDocument) return
  const reversibleAction: ReversibleAction<PureWrapAction, PureUnwrapAction> = {
    action: pureWrap({ id, newId, document: documentHandler(newId) })(
      action.scope
    ),
    reverse: pureUnwrap({ id, oldId: newId })(action.scope)
  }
  yield put(commit([reversibleAction])(action.scope))
}

function* unwrapSaga(action: UnwrapAction) {
  const { id, oldId } = action.payload
  const currentDocument: SelectorReturnType<typeof getDocument> = yield select(
    scopeSelector(getDocument, action.scope),
    id
  )
  if (!currentDocument) return
  const reversibleAction: ReversibleAction<PureUnwrapAction, PureWrapAction> = {
    action: pureUnwrap({ id, oldId })(action.scope),
    reverse: pureWrap({
      id,
      newId: oldId,
      document: currentDocument
    })(action.scope)
  }
  yield put(commit([reversibleAction])(action.scope))
}

function* replaceSaga(action: ReplaceAction) {
  const { id } = action.payload
  const currentDocument: SelectorReturnType<typeof getDocument> = yield select(
    scopeSelector(getDocument, action.scope),
    id
  )
  if (!currentDocument) return
  const plugin: SelectorReturnType<typeof getPlugin> = yield select(
    scopeSelector(getPlugin, action.scope),
    action.payload.plugin
  )
  if (!plugin) return
  const pendingDocs: {
    id: string
    plugin: string
    state?: unknown
  }[] = []
  const helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }
  let pluginState: unknown
  if (action.payload.state === undefined) {
    pluginState = plugin.state.createInitialState(helpers)
  } else {
    pluginState = plugin.state.deserialize(action.payload.state, helpers)
  }
  const [actions]: [ReversibleAction[], unknown] = yield call(
    handleRecursiveInserts,
    action.scope,
    () => {},
    pendingDocs
  )

  const reversibleAction: ReversibleAction<
    PureReplaceAction,
    PureReplaceAction
  > = {
    action: pureReplace({
      id,
      plugin: action.payload.plugin,
      state: pluginState
    })(action.scope),
    reverse: pureReplace({
      id,
      plugin: currentDocument.plugin,
      state: currentDocument.state
    })(action.scope)
  }
  yield put(commit([...actions, reversibleAction])(action.scope))
}

interface ChannelAction {
  resolve?: StateUpdater<unknown>
  next?: StateUpdater<unknown>
  reject?: StateUpdater<unknown>
  scope: string
  callback: (actions: ReversibleAction[], pureState: unknown) => void
}

export function* handleRecursiveInserts(
  scope: string,
  act: (helpers: StoreDeserializeHelpers) => unknown,
  initialDocuments: { id: string; plugin: string; state?: unknown }[] = []
) {
  const actions: ReversibleAction[] = []
  const pendingDocs: {
    id: string
    plugin: string
    state?: unknown
  }[] = initialDocuments
  const helpers: StoreDeserializeHelpers = {
    createDocument(doc) {
      pendingDocs.push(doc)
    }
  }
  const result = act(helpers)
  for (let doc; (doc = pendingDocs.pop()); ) {
    const plugin: SelectorReturnType<typeof getPlugin> = yield select(
      scopeSelector(getPlugin, scope),
      doc.plugin
    )
    if (!plugin) {
      invariant(false, `Invalid plugin '${doc.plugin}'`)
      continue
    }
    let state: unknown
    if (doc.state === undefined) {
      state = plugin.state.createInitialState(helpers)
    } else {
      state = plugin.state.deserialize(doc.state, helpers)
    }
    actions.push({
      action: pureInsert({
        id: doc.id,
        plugin: doc.plugin,
        state
      })(scope),
      reverse: pureRemove(doc.id)(scope)
    })
  }
  return [actions, result]
}
