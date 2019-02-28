import { HighlightEditor } from './editor'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const highlightState = StateType.object({
  text: StateType.string(''),
  language: StateType.string(''),
  lineNumbers: StateType.boolean(false)
})

export const highlightPlugin: StatefulPlugin<typeof highlightState> = {
  Component: HighlightEditor,
  state: highlightState
}
