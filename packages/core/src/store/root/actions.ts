import {
  ActionFromCreator,
  createAction,
  createActionWithoutPayload
} from '../helpers'
import { Plugin } from '@edtr-io/core'

export const initRoot = createAction<
  'InitRoot',
  {
    initialState?: {
      plugin?: string
      state?: unknown
    }
    plugins: Record<string, Plugin>
    defaultPlugin: string
  }
>('InitRoot')
export type InitRootAction = ActionFromCreator<typeof initRoot>
export const pureInitRoot = createActionWithoutPayload<'PureInitRoot'>(
  'PureInitRoot'
)
export type PureInitRootAction = ActionFromCreator<typeof pureInitRoot>

export type RootAction = InitRootAction | PureInitRootAction

export const publicRootActions = { initRoot }
