import { StoreDeserializeHelpers } from '../../plugin-state'
import { createAction } from '../helpers'
import { ActionFromActionCreator, DocumentState } from '../types'

export const insert = createAction<
  'Insert',
  {
    id: string
    plugin?: string
    state?: unknown
  }
>('Insert')
export type InsertAction = ActionFromActionCreator<typeof insert>
export const pureInsert = createAction<
  'PureInsert',
  {
    id: string
  } & DocumentState
>('PureInsert')
export type PureInsertAction = ActionFromActionCreator<typeof pureInsert>

export const remove = createAction<'Remove', string>('Remove')
export type RemoveAction = ActionFromActionCreator<typeof remove>

export const change = createAction<
  'Change',
  {
    id: string
    state: (value: unknown, helpers: StoreDeserializeHelpers) => unknown
  }
>('Change')
export type ChangeAction = ActionFromActionCreator<typeof change>
export const pureChange = createAction<
  'PureChange',
  { id: string; state: unknown }
>('PureChange')
export type PureChangeAction = ActionFromActionCreator<typeof pureChange>

export type DocumentsAction =
  | InsertAction
  | PureInsertAction
  | RemoveAction
  | PureChangeAction
  | ChangeAction

export const publicDocumentsActions = {
  insert,
  remove,
  change
}
