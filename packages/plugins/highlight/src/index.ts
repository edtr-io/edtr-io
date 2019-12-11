import { StatefulPlugin, string, boolean, object } from '@edtr-io/plugin'
import { createIcon, faCode } from '@edtr-io/ui'
import * as React from 'react'

import { createHighlightEditor } from './editor'
import { HighlightRenderer, HighlightRendererProps } from './renderer'

export const highlightState = object({
  text: string(''),
  language: string('text'),
  lineNumbers: boolean(false)
})

export const highlightPlugin: StatefulPlugin<
  typeof highlightState
> = createHighlightPlugin({ renderer: HighlightRenderer })

export function createHighlightPlugin(
  config: HighlightPluginConfig
): StatefulPlugin<typeof highlightState> {
  return {
    Component: createHighlightEditor(config),
    state: highlightState,
    title: 'Code',
    description:
      'Schreibe Code und lasse ihn je nach Programmiersprache highlighten.',
    icon: createIcon(faCode)
  }
}

export interface HighlightPluginConfig {
  renderer: React.ComponentType<HighlightRendererProps>
}
