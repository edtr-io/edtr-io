import { Action, ScopedState } from '@edtr-io/store'
import { Unsubscribe } from 'redux'

// TODO: Think about moving this to a better place (maybe it's not even necessary)
export interface Store {
  dispatch: (scopedAction: (scope: string) => Action) => void
  getState: () => ScopedState
  subscribe: (listener: () => void) => Unsubscribe
}
