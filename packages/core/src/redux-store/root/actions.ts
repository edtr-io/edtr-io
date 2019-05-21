import { createActionWithoutPayload } from '../helpers'

export const initRoot = createActionWithoutPayload<'InitRoot'>('InitRoot')
export type InitRootAction = ReturnType<typeof initRoot>

export type RootAction = InitRootAction
