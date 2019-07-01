import * as R from 'ramda'

import { createSubReducer } from '../helpers'
import { EditorState, StoreState } from '../types'
import { pureCopy, PureCopyAction } from './actions'

export const clipboardReducer = createSubReducer('clipboard', [], {
  [pureCopy.type](clipboardState, action: PureCopyAction) {
    const maxLength = 3
    const appended = R.prepend(action.payload, clipboardState)
    const nextClipboard =
      appended.length > maxLength
        ? R.remove(maxLength, appended.length - maxLength, appended)
        : appended

    return nextClipboard
  }
})

export function publicGetClipboard(state: EditorState) {
  return state.clipboard
}
export function getClipboard(state: StoreState, scope: string) {
  return publicGetClipboard(state[scope])
}

export const publicClipboardSelectors = { getClipboard: publicGetClipboard }
