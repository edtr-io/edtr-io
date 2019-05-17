import { DocumentState } from './reducer'

/* Mode */
export const setEditable = createAction<'SetEditable', boolean>('SetEditable')
export type SetEditableAction = ReturnType<typeof setEditable>

/* Documents */
export const insert = createAction<
  'Insert',
  {
    id: string
  } & Partial<DocumentState>
>('Insert')
export type InsertAction = ReturnType<typeof insert>

/* Clipboard */
export const copy = createAction<'Copy', string>('Copy')
export type CopyAction = ReturnType<typeof copy>

export type Action = SetEditableAction | InsertAction | CopyAction

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
