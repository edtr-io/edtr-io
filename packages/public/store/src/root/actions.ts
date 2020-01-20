import { EditorPlugin } from '@edtr-io/internal__plugin'

import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

/** @public */
export const initRoot = createAction<
  'InitRoot',
  {
    initialState?: {
      plugin?: string
      state?: unknown
    }
    plugins: Record<string, EditorPlugin>
    defaultPlugin: string
  }
>('InitRoot')
/** @public */
export type InitRootAction = ActionFromActionCreator<typeof initRoot>
/** @public */
export const pureInitRoot = createActionWithoutPayload<'PureInitRoot'>(
  'PureInitRoot'
)
/** @public */
export type PureInitRootAction = ActionFromActionCreator<typeof pureInitRoot>

/** @public */
export type RootAction = InitRootAction | PureInitRootAction
