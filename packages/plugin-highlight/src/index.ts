import { createIcon, faCode } from '@edtr-io/editor-ui'
import { boolean, object, string, StatefulPlugin } from '@edtr-io/plugin'

import { HighlightEditor } from './editor'

export const highlightState = object({
  text: string(''),
  language: string('text'),
  lineNumbers: boolean(false)
})

export const highlightPlugin: StatefulPlugin<typeof highlightState> = {
  Component: HighlightEditor,
  state: highlightState,
  title: 'Code',
  description:
    'Schreibe Code und lasse ihn je nach Programmiersprache highlighten.',
  icon: createIcon(faCode)
}
