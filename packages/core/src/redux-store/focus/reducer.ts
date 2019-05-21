import { createSubReducer } from '../helpers'
import { State } from '../types'
import { focus, FocusDocumentAction } from './actions'

export const focusReducer = createSubReducer('focus', null, {
  [focus.type](_state, action: FocusDocumentAction) {
    return action.payload
  }
})

export function getFocused(state: State) {
  return state.focus
}
