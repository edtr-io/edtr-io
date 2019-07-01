import { ActionFromCreator, createAction } from '../helpers'
import { DocumentState } from '../types'

export const copy = createAction<'Copy', string | null>('Copy')
export type CopyAction = ActionFromCreator<typeof copy>

export const pureCopy = createAction<'PureCopy', DocumentState>('PureCopy')
export type PureCopyAction = ActionFromCreator<typeof pureCopy>

export type ClipboardAction = CopyAction | PureCopyAction

export const publicClipboardActions = { copy }
