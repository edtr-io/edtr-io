import { createActionCreator, createActionWithoutPayload } from '../helpers'
import {
  ActionCreatorAction,
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '../types'

/** @public */
export const blur: ActionCreatorWithoutPayload<'Blur'> =
  createActionWithoutPayload('Blur')
/** @public */
export type BlurAction = ActionCreatorAction<typeof blur>

/** @public */
export const focus: ActionCreatorWithPayload<'Focus', string> =
  createActionCreator('Focus')
/** @public */
export type FocusDocumentAction = ActionCreatorAction<typeof focus>

/** @public */
export const focusNext: ActionCreatorWithoutPayload<'FocusNext'> =
  createActionWithoutPayload('FocusNext')
/** @public */
export type FocusNextDocumentAction = ActionCreatorAction<typeof focusNext>

/** @public */
export const focusPrevious: ActionCreatorWithoutPayload<'FocusPrevious'> =
  createActionWithoutPayload('FocusPrevious')
/** @public */
export type FocusPreviousDocumentAction = ActionCreatorAction<
  typeof focusPrevious
>

/** @public */
export type FocusAction =
  | BlurAction
  | FocusDocumentAction
  | FocusNextDocumentAction
  | FocusPreviousDocumentAction
