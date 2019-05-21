import { initRoot, InitRootAction } from './actions'
import { createSubReducer } from '../helpers'
import { State } from '../types'

export const rootReducer = createSubReducer('root', null, {
  [initRoot.type](_state, _action: InitRootAction) {
    return 'root'
  }
})

export function getRoot(state: State) {
  return state.root
}
