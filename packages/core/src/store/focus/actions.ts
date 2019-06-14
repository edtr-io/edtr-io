import { createAction, createActionWithoutPayload } from '../helpers'

export const focus = createAction<'Focus', string>('Focus')
export type FocusDocumentAction = ReturnType<typeof focus>

export const focusNext = createActionWithoutPayload<'FocusNext'>('FocusNext')
export type FocusNextDocumentAction = ReturnType<typeof focusNext>

export const focusPrevious = createActionWithoutPayload<'FocusPrevious'>(
  'FocusPrevious'
)
export type FocusPreviousDocumentAction = ReturnType<typeof focusPrevious>

export type FocusAction =
  | FocusDocumentAction
  | FocusNextDocumentAction
  | FocusPreviousDocumentAction

export const publicFocusActions = {
  focus,
  focusNext,
  focusPrevious
}
