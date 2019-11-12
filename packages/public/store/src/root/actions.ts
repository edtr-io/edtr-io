/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Plugin } from '@edtr-io/internal__plugin'

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
