import { EditorPlugin } from '@edtr-io/internal__plugin'
import * as R from 'ramda'
import { channel, Channel } from 'redux-saga'
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects'

import { InternalAction } from '../actions'
import { change, ChangeAction, getDocument } from '../documents'
import { getFocusTree } from '../focus'
import { scopeSelector } from '../helpers'
import { getPlugin } from '../plugins'
import { SelectorReturnType } from '../types'
import {
  insertChildAfter,
  InsertChildAfterAction,
  insertChildBefore,
  InsertChildBeforeAction,
  removeChild,
  RemoveChildAction
} from './actions'

export function* pluginSaga() {
  yield all([
    takeEvery(insertChildBefore.type, insertChildBeforeSaga),
    takeEvery(insertChildAfter.type, insertChildAfterSaga),
    takeEvery(removeChild.type, removeChildSaga)
  ])
}

function* insertChildBeforeSaga({ payload, scope }: InsertChildBeforeAction) {
  const parent: SelectorReturnType<typeof getFocusTree> = yield select(
    scopeSelector(getFocusTree, scope),
    payload.parent
  )
  if (!parent || !parent.children) return
  const index = R.findIndex(
    child => child.id === payload.sibling,
    parent.children
  )
  if (index === -1) return
  yield call(insertChild, {
    parent: payload.parent,
    previousSibling: index === 0 ? undefined : parent.children[index - 1].id,
    document: payload.document,
    scope
  })
}

function* insertChildAfterSaga({ payload, scope }: InsertChildAfterAction) {
  yield call(insertChild, {
    parent: payload.parent,
    previousSibling: payload.sibling,
    document: payload.document,
    scope
  })
}

function* removeChildSaga({ payload, scope }: RemoveChildAction) {
  yield call(createPlugin, payload.parent, scope, (plugin, state) => {
    if (typeof plugin.removeChild !== 'function') return
    plugin.removeChild(state, payload.child)
  })
}

function* insertChild(payload: {
  parent: string
  previousSibling?: string
  document?: { plugin: string; state?: unknown }
  scope: string
}) {
  yield call(createPlugin, payload.parent, payload.scope, (plugin, state) => {
    if (typeof plugin.insertChild !== 'function') return
    plugin.insertChild(state, {
      previousSibling: payload.previousSibling,
      document: payload.document
    })
  })
}

function* createPlugin(
  id: string,
  scope: string,
  f: (plugin: EditorPlugin, state: unknown) => void
) {
  const document: SelectorReturnType<typeof getDocument> = yield select(
    scopeSelector(getDocument, scope),
    id
  )
  if (!document) return
  const plugin: SelectorReturnType<typeof getPlugin> = yield select(
    scopeSelector(getPlugin, scope),
    document.plugin
  )
  if (!plugin) return
  const chan: Channel<InternalAction> = yield call(channel)
  const state = plugin.state.init(document.state, (initial, executor) => {
    const action = change({
      id,
      state: {
        initial,
        executor
      }
    })(scope)
    chan.put(action)
  })
  f(plugin, state)
  chan.close()
  yield call(channelSaga, chan)

  function* channelSaga(chan: Channel<InternalAction>) {
    while (true) {
      const action: ChangeAction = yield take(chan)
      yield put(action)
    }
  }
}
