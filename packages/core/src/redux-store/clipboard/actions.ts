import { createAction } from '../helpers'
import { DocumentState } from '../types'

export const copy = createAction<'Copy', DocumentState>('Copy')
export type CopyAction = ReturnType<typeof copy>

export type ClipboardAction = CopyAction
