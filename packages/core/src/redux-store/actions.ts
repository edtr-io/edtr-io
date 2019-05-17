import { DocumentState } from './reducer'

/* Mode */
export const setEditable = createAction<'SetEditable', boolean>('SetEditable')
export type SetEditableAction = ReturnType<typeof setEditable>

/* Documents */
export const insert = createAction<
  'Insert',
  {
    id: string
  } & DocumentState
>('Insert')
export type InsertAction = ReturnType<typeof insert>
export const remove = createAction<'Remove', string>('Remove')
export type RemoveAction = ReturnType<typeof remove>
export const change = createAction<'Change', { id: string; state: unknown }>(
  'Change'
)
export type ChangeAction = ReturnType<typeof change>

/* Clipboard */
export const copy = createAction<'Copy', string>('Copy')
export type CopyAction = ReturnType<typeof copy>

export type Action =
  | SetEditableAction
  | InsertAction
  | RemoveAction
  | ChangeAction
  | CopyAction

function createAction<T, P>(type: T) {
  const actionCreator = (payload: P) => {
    return {
      type,
      payload
    }
  }
  actionCreator.type = type

  return actionCreator
}
