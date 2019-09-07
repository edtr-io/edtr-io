import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

export const focus = createAction<'Focus', string>('Focus')
export type FocusDocumentAction = ActionFromActionCreator<typeof focus>

export const focusNext = createActionWithoutPayload<'FocusNext'>('FocusNext')
export type FocusNextDocumentAction = ActionFromActionCreator<typeof focusNext>

export const focusPrevious = createActionWithoutPayload<'FocusPrevious'>(
  'FocusPrevious'
)
export type FocusPreviousDocumentAction = ActionFromActionCreator<
  typeof focusPrevious
>

export type FocusAction =
  | FocusDocumentAction
  | FocusNextDocumentAction
  | FocusPreviousDocumentAction
