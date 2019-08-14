import { StatefulPlugin, StateType } from '@edtr-io/core'
import { createIcon, faCode } from '@edtr-io/editor-ui'

import { HighlightEditor } from './editor'

export const highlightState = StateType.object({
  text: StateType.string(''),
  language: StateType.string('text'),
  lineNumbers: StateType.boolean(false)
})

export const highlightPlugin: StatefulPlugin<typeof highlightState> = {
  Component: HighlightEditor,
  state: highlightState,
  title: 'Code',
  description:
    'Schreibe Code und lasse ihn je nach Programmiersprache highlighten.',
  icon: createIcon(faCode)
}
