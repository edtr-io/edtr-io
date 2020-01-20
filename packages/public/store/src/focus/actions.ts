import { createAction, createActionWithoutPayload } from '../helpers'
import { ActionFromActionCreator } from '../types'

/** @public */
export const blur = createActionWithoutPayload<'Blur'>('Blur')
/** @public */
export type BlurAction = ActionFromActionCreator<typeof blur>

/** @public */
export const focus = createAction<'Focus', string>('Focus')
/** @public */
export type FocusDocumentAction = ActionFromActionCreator<typeof focus>

/** @public */
export const focusNext = createActionWithoutPayload<'FocusNext'>('FocusNext')
/** @public */
export type FocusNextDocumentAction = ActionFromActionCreator<typeof focusNext>

/** @public */
export const focusPrevious = createActionWithoutPayload<'FocusPrevious'>(
  'FocusPrevious'
)
/** @public */
export type FocusPreviousDocumentAction = ActionFromActionCreator<
  typeof focusPrevious
>

/** @public */
export type FocusAction =
  | BlurAction
  | FocusDocumentAction
  | FocusNextDocumentAction
  | FocusPreviousDocumentAction
