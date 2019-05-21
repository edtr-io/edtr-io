import { SetEditableAction, setEditable } from './actions'
import { createSubReducer } from '../helpers'
import { State } from '../types'

export const modeReducer = createSubReducer(
  'mode',
  { editable: true },
  {
    [setEditable.type](_state, action: SetEditableAction) {
      return { editable: action.payload }
    }
  }
)

export const isEditable = (state: State) => state.mode.editable
