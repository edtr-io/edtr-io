import { createAction } from '../helpers'

export const setEditable = createAction<'SetEditable', boolean>('SetEditable')
export type SetEditableAction = ReturnType<typeof setEditable>

export type ModeAction = SetEditableAction

export const publicModeActions = {
  setEditable
}
