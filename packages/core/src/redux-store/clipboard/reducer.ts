import * as R from 'ramda'

import { createSubReducer } from '../helpers'
import { State } from '../types'
import { pureCopy, PureCopyAction } from './actions'

export const clipboardReducer = createSubReducer('clipboard', [], {
  [pureCopy.type](state, action: PureCopyAction) {
    const maxLength = 3
    const appended = R.prepend(action.payload, state)
    const nextClipboard =
      appended.length > maxLength
        ? R.remove(maxLength, appended.length - maxLength, appended)
        : appended

    return nextClipboard
  }
})

export function getClipboard(state: State) {
  return state.clipboard
}
