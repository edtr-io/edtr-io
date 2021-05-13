import { EditorPlugin } from '@edtr-io/internal__plugin'

import { createActionCreator, createActionWithoutPayload } from '../helpers'
import {
  ActionCreatorAction,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '../types'

/** @public */
export const initRoot: ActionCreatorWithPayload<
  'InitRoot',
  {
    initialState: {
      plugin: string
      state?: unknown
    }
    plugins: Record<string, EditorPlugin>
  }
> = createActionCreator('InitRoot')
/** @public */
export type InitRootAction = ActionCreatorAction<typeof initRoot>
/** @internal */
export const pureInitRoot: ActionCreatorWithoutPayload<'PureInitRoot'> =
  createActionWithoutPayload('PureInitRoot')
/** @internal */
export type PureInitRootAction = ActionCreatorAction<typeof pureInitRoot>

/** @public */
export type RootAction = InitRootAction
/** @internal */
export type InternalRootAction = PureInitRootAction
