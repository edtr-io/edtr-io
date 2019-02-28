import { InjectionEditor } from './editor'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const injectionState = StateType.object({
  src: StateType.string(''),
  alt: StateType.string('')
})

export const injectionPlugin: StatefulPlugin<typeof injectionState> = {
  Component: InjectionEditor,
  state: injectionState
}
