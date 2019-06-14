import { DocumentState } from '../types'
import { createAction } from '../helpers'
import { StoreDeserializeHelpers } from '../../plugin-state'

export const insert = createAction<
  'Insert',
  {
    id: string
    plugin?: string
    state?: unknown
  }
>('Insert')
export type InsertAction = ReturnType<typeof insert>
export const pureInsert = createAction<
  'PureInsert',
  {
    id: string
  } & DocumentState
>('PureInsert')
export type PureInsertAction = ReturnType<typeof pureInsert>

export const remove = createAction<'Remove', string>('Remove')
export type RemoveAction = ReturnType<typeof remove>

export const change = createAction<
  'Change',
  {
    id: string
    state: (value: unknown, helpers: StoreDeserializeHelpers) => unknown
  }
>('Change')
export type ChangeAction = ReturnType<typeof change>
export const pureChange = createAction<
  'PureChange',
  { id: string; state: unknown }
>('PureChange')
export type PureChangeAction = ReturnType<typeof pureChange>

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
