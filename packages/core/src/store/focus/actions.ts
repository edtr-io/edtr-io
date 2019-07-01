import {
  ActionFromCreator,
  createAction,
  createActionWithoutPayload
} from '../helpers'

export const focus = createAction<'Focus', string>('Focus')
export type FocusDocumentAction = ActionFromCreator<typeof focus>

export const focusNext = createActionWithoutPayload<'FocusNext'>('FocusNext')
export type FocusNextDocumentAction = ActionFromCreator<typeof focusNext>

export const focusPrevious = createActionWithoutPayload<'FocusPrevious'>(
  'FocusPrevious'
)
export type FocusPreviousDocumentAction = ActionFromCreator<
  typeof focusPrevious
>

export type FocusAction =
  | FocusDocumentAction
  | FocusNextDocumentAction
  | FocusPreviousDocumentAction

export const publicFocusActions = {
  focus,
  focusNext,
  focusPrevious
}
