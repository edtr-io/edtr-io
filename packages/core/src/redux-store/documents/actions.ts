import { DocumentState } from '../types'
import { createAction } from '../helpers'

export const pureInsert = createAction<
  'PureInsert',
  {
    id: string
  } & DocumentState
>('PureInsert')
export type PureInsertAction = ReturnType<typeof pureInsert>

export const insert = createAction<
  'Insert',
  {
    id: string
    plugin?: string
    state?: unknown
  }
>('Insert')
export type InsertAction = ReturnType<typeof insert>

export const remove = createAction<'Remove', string>('Remove')
export type RemoveAction = ReturnType<typeof remove>

export const change = createAction<'Change', { id: string; state: unknown }>(
  'Change'
)
export type ChangeAction = ReturnType<typeof change>

export type DocumentsAction =
  | InsertAction
  | PureInsertAction
  | RemoveAction
  | ChangeAction
