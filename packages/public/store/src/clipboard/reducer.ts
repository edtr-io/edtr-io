import * as R from 'ramda'

import { createSelector, createSubReducer, SubReducer } from '../helpers'
import { DocumentState, Selector } from '../types'
import { pureCopy, PureCopyAction } from './actions'

/** @internal */
export const clipboardReducer: SubReducer<DocumentState[]> = createSubReducer(
  'clipboard',
  [],
  {
    [pureCopy.type](clipboardState, action: PureCopyAction) {
      const maxLength = 3
      const appended = R.prepend(action.payload, clipboardState)
      const nextClipboard =
        appended.length > maxLength
          ? R.remove(maxLength, appended.length - maxLength, appended)
          : appended

      return nextClipboard
    },
  }
)

/** @beta */
export const getClipboard: Selector<DocumentState[]> = createSelector(
  (state) => state.clipboard
)
