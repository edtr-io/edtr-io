import { createIcon, faCode } from '@edtr-io/editor-ui'
import { legacyBoolean, object, legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { HighlightEditor } from './editor'

export const highlightState = object({
  text: legacyString(''),
  language: legacyString('text'),
  lineNumbers: legacyBoolean(false)
})

export const highlightPlugin: StatefulPlugin<typeof highlightState> = {
  Component: HighlightEditor,
  state: highlightState,
  title: 'Code',
  description:
    'Schreibe Code und lasse ihn je nach Programmiersprache highlighten.',
  icon: createIcon(faCode)
}
