import { ActionFromCreator, createAction } from '../helpers'

export const initRoot = createAction<
  'InitRoot',
  {
    plugin?: string
    state?: unknown
  }
>('InitRoot')
export type InitRootAction = ActionFromCreator<typeof initRoot>

export type RootAction = InitRootAction

export const publicRootActions = { initRoot }
