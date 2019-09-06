import { createAction } from '../helpers'
import { ActionFromActionCreator, DocumentState } from '../types'

export const copy = createAction<'Copy', string | null>('Copy')
export type CopyAction = ActionFromActionCreator<typeof copy>

export const pureCopy = createAction<'PureCopy', DocumentState>('PureCopy')
export type PureCopyAction = ActionFromActionCreator<typeof pureCopy>

export type ClipboardAction = CopyAction | PureCopyAction
