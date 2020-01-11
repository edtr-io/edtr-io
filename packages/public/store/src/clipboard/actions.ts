/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { createAction } from '../helpers'
import { ActionFromActionCreator, DocumentState } from '../types'

/** @public */
export const copy = createAction<'Copy', string | null>('Copy')
/** @public */
export type CopyAction = ActionFromActionCreator<typeof copy>

/** @public */
export const pureCopy = createAction<'PureCopy', DocumentState>('PureCopy')
/** @public */
export type PureCopyAction = ActionFromActionCreator<typeof pureCopy>

/** @public */
export type ClipboardAction = CopyAction | PureCopyAction
