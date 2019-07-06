import { Plugin } from '../../plugin'
import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

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
export type InitRootAction = ActionFromActionCreator<typeof initRoot>
export const pureInitRoot = createActionWithoutPayload<'PureInitRoot'>(
  'PureInitRoot'
)
export type PureInitRootAction = ActionFromActionCreator<typeof pureInitRoot>

export type RootAction = InitRootAction | PureInitRootAction

export const publicRootActions = { initRoot }
