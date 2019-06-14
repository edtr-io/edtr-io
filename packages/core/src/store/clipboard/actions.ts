import { createAction } from '../helpers'
import { DocumentState } from '../types'

export const copy = createAction<'Copy', string | null>('Copy')
export type CopyAction = ReturnType<typeof copy>

export const pureCopy = createAction<'PureCopy', DocumentState>('PureCopy')
export type PureCopyAction = ReturnType<typeof pureCopy>

export type ClipboardAction = CopyAction | PureCopyAction

export const publicClipboardActions = { copy }
