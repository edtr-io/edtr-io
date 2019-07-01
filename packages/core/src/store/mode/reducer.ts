import { SetEditableAction, setEditable } from './actions'
import { createSubReducer } from '../helpers'
import { EditorState, StoreState } from '../types'

export const modeReducer = createSubReducer(
  'mode',
  { editable: true },
  {
    [setEditable.type](_modeState, action: SetEditableAction) {
      return { editable: action.payload }
    }
  }
)

export const publicIsEditable = (state: EditorState) => state.mode.editable
export const isEditable = (state: StoreState, scope: string) =>
  publicIsEditable(state[scope])

export const publicModeSelectors = { isEditable: publicIsEditable }
