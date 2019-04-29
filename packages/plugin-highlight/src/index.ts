import { StatefulPlugin, StateType } from '@edtr-io/core'

import { HighlightEditor } from './editor'
import { createIcon, faCode } from '@edtr-io/editor-ui'

export const highlightState = StateType.object({
  text: StateType.string(''),
  language: StateType.string('text'),
  lineNumbers: StateType.boolean(false)
})

export const highlightPlugin: StatefulPlugin<typeof highlightState> = {
  Component: HighlightEditor,
  state: highlightState,
  icon: createIcon(faCode)
}
