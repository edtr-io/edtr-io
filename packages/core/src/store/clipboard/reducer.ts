import * as R from 'ramda'

import { createSubReducer } from '../helpers'
import { ScopeState } from '../types'
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

export function getClipboard(state: ScopeState) {
  return state.clipboard
}

export const publicClipboardSelectors = { getClipboard }
