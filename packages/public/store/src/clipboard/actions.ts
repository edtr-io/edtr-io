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
