import { StateType, StatefulPlugin } from '@edtr-io/core'

import { InjectionEditor } from './editor'

export const injectionState = StateType.object({
  src: StateType.string(''),
  alt: StateType.string('')
})

export const injectionPlugin: StatefulPlugin<typeof injectionState> = {
  Component: InjectionEditor,
  state: injectionState
}
