import { createAction } from '../helpers'

export const initRoot = createAction<
  'InitRoot',
  {
    plugin?: string
    state?: unknown
  }
>('InitRoot')
export type InitRootAction = ReturnType<typeof initRoot>

export type RootAction = InitRootAction

export const publicRootActions = { initRoot }
