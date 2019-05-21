import { DocumentState } from '../types'
import { createAction } from '../helpers'

export const insert = createAction<
  'Insert',
  {
    id: string
  } & DocumentState
>('Insert')
export type InsertAction = ReturnType<typeof insert>

export const asyncInsert = createAction<
  'AsyncInsert',
  {
    id: string
  } & DocumentState
>('AsyncInsert')
export type AsyncInsertAction = ReturnType<typeof asyncInsert>

export const remove = createAction<'Remove', string>('Remove')
export type RemoveAction = ReturnType<typeof remove>

export const change = createAction<'Change', { id: string; state: unknown }>(
  'Change'
)
export type ChangeAction = ReturnType<typeof change>

export type DocumentsAction =
  | InsertAction
  | AsyncInsertAction
  | RemoveAction
  | ChangeAction
