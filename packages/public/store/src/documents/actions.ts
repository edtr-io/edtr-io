/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { StateExecutor, StateUpdater } from '@edtr-io/internal__plugin-state'

import { createAction } from '../helpers'
import { ActionFromActionCreator, DocumentState } from '../types'

/** @public */
export const insert = createAction<
  'Insert',
  {
    id: string
    plugin?: string
    state?: unknown
  }
>('Insert')
/** @public */
export type InsertAction = ActionFromActionCreator<typeof insert>
/** @public */
export const pureInsert = createAction<
  'PureInsert',
  {
    id: string
  } & DocumentState
>('PureInsert')
/** @public */
export type PureInsertAction = ActionFromActionCreator<typeof pureInsert>

/** @public */
export const remove = createAction<'Remove', string>('Remove')
/** @public */
export type RemoveAction = ActionFromActionCreator<typeof remove>

/** @public */
export const pureRemove = createAction<'PureRemove', string>('PureRemove')
/** @public */
export type PureRemoveAction = ActionFromActionCreator<typeof pureRemove>

/** @public */
export const change = createAction<
  'Change',
  {
    id: string
    state: {
      initial: StateUpdater<unknown>
      executor?: StateExecutor<StateUpdater<unknown>>
    }
  }
>('Change')
/** @public */
export type ChangeAction = ActionFromActionCreator<typeof change>
/** @public */
export const pureChange = createAction<
  'PureChange',
  { id: string; state: unknown }
>('PureChange')
/** @public */
export type PureChangeAction = ActionFromActionCreator<typeof pureChange>

/** @public */
export type DocumentsAction =
  | InsertAction
  | PureInsertAction
  | RemoveAction
  | PureRemoveAction
  | ChangeAction
  | PureChangeAction
