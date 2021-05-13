import * as R from 'ramda'
import { channel, Channel } from 'redux-saga'
import {
  all,
  call,
  delay,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import { applyActions, ReversibleAction } from '../actions'
import { scopeSelector } from '../helpers'
import { InternalSelectorReturnType, SelectorReturnType } from '../types'
import {
  undo,
  redo,
  pureUndo,
  pureRedo,
  commit,
  pureCommit,
  reset,
  pureReset,
  UndoAction,
  RedoAction,
  ResetAction,
  temporaryCommit,
  TemporaryCommitAction,
  CommitAction,
} from './actions'
import { getPendingChanges, getRedoStack, getUndoStack } from './reducer'

export function* historySaga() {
  yield all([
    call(commitSaga),
    takeEvery(temporaryCommit.type, temporaryCommitSaga),
    takeEvery(undo.type, undoSaga),
    takeEvery(redo.type, redoSaga),
    takeEvery(reset.type, resetSaga),
  ])
}

function* temporaryCommitSaga(action: TemporaryCommitAction) {
  const actions = action.payload.initial
  yield all(actions.map((action) => put(action.action)))
  yield put(
    pureCommit({
      combine: false,
      actions,
    })(action.scope)
  )
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const chan: Channel<ChannelAction> = yield call(channel)

  function createPutToChannel(type: 'resolve' | 'reject' | 'next') {
    return function (finalActions: ReversibleAction[]) {
      chan.put({
        [type]: finalActions,
        scope: action.scope,
        tempActions: actions,
      })
    }
  }
  if (action.payload.executor) {
    action.payload.executor(
      createPutToChannel('resolve'),
      createPutToChannel('reject'),
      createPutToChannel('next')
    )
    yield call(resolveSaga, chan)
  }
}

interface ChannelAction {
  resolve?: ReversibleAction[]
  next?: ReversibleAction[]
  reject?: ReversibleAction[]
  scope: string
  tempActions: ReversibleAction[]
}

function* resolveSaga(chan: Channel<ChannelAction>) {
  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: ChannelAction = yield take(chan)
    const finalActions = payload.resolve || payload.next || payload.reject || []
    const tempActions = payload.tempActions

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stack: InternalSelectorReturnType<typeof getUndoStack> = yield select(
      scopeSelector(getUndoStack, payload.scope)
    )

    const replays = R.takeWhile((replay) => replay !== tempActions, stack)
    // revert all actions until the temporary actions
    yield all(
      replays.map((replay) => {
        return all(replay.map((a) => put(a.reverse)))
      })
    )
    // then revert the temporary action
    yield all(tempActions.map((a) => put(a.reverse)))

    // apply final actions and all reverted actions
    yield all(finalActions.map((a) => put(a.action)))

    yield all(
      replays.map((replay) => {
        return all(replay.map((a) => put(a.action)))
      })
    )

    // replace in history
    replaceInArray(tempActions, finalActions)
    if (payload.resolve || payload.reject) {
      break
    }
  }
  chan.close()
}

function replaceInArray<T>(arr: T[], arr2: T[]) {
  arr.splice(0, arr.length, ...arr2)
}

function* commitSaga() {
  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const action: CommitAction = yield take(commit.type)
    yield call(executeCommit, action.payload, false, action.scope)

    while (true) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { action, timeout }: { action: CommitAction; timeout: boolean } =
        yield race({
          action: take(commit.type),
          timeout: delay(1000),
        })

      if (timeout) {
        break
      }

      if (action) {
        yield call(executeCommit, action.payload, true, action.scope)
      }
    }
  }
}

function* executeCommit(
  actions: ReversibleAction[],
  combine: boolean,
  scope: string
) {
  yield all(actions.map((action) => put(action.action)))
  yield put(
    pureCommit({
      combine,
      actions,
    })(scope)
  )
}

function* undoSaga(action: UndoAction) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const undoStack: InternalSelectorReturnType<typeof getUndoStack> =
    yield select(scopeSelector(getUndoStack, action.scope))
  const toUndo = R.head(undoStack)
  if (!toUndo) return

  const actions = R.reverse(toUndo).map(
    (reversibleAction) => reversibleAction.reverse
  )
  yield put(applyActions(actions)(action.scope))
  yield put(pureUndo()(action.scope))
}

function* redoSaga(action: RedoAction) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const redoStack: InternalSelectorReturnType<typeof getRedoStack> =
    yield select(scopeSelector(getRedoStack, action.scope))
  const replay = R.head(redoStack)
  if (!replay) return
  const actions = replay.map((reversibleAction) => reversibleAction.action)
  yield put(applyActions(actions)(action.scope))
  yield put(pureRedo()(action.scope))
}

function* resetSaga(action: ResetAction) {
  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pendingChanges: SelectorReturnType<typeof getPendingChanges> =
      yield select(scopeSelector(getPendingChanges, action.scope))
    if (pendingChanges === 0) break
    else if (pendingChanges < 0) {
      yield call(redoSaga, redo()(action.scope))
    } else {
      yield call(undoSaga, undo()(action.scope))
    }
  }
  yield put(pureReset()(action.scope))
}
