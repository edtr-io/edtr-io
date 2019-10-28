import { boolean, object, StatefulPlugin, string } from '@edtr-io/plugin'
import { createIcon, faCode } from '@edtr-io/ui'

import { HighlightEditor } from './editor'

export const highlightState = object({
  text: string(''),
  language: string('text'),
  lineNumbers: boolean(false)
})

export function createHighlightPlugin(): StatefulPlugin<typeof highlightState> {
  return {
    Component: HighlightEditor,
    config: {},
    state: highlightState,
    title: 'Code',
    description:
      'Schreibe Code und lasse ihn je nach Programmiersprache highlighten.',
    icon: createIcon(faCode)
  }
}
