import { createAction } from '../helpers'
import { DocumentState } from '../types'

export const initRoot = createAction<'InitRoot', DocumentState>('InitRoot')
export type InitRootAction = ReturnType<typeof initRoot>

export type RootAction = InitRootAction
