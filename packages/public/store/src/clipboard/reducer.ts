/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as R from 'ramda'

import { createSelector, createSubReducer } from '../helpers'
import { pureCopy, PureCopyAction } from './actions'

/** @internal */
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

/** @public */
export const getClipboard = createSelector(state => state.clipboard)
