import * as React from 'react'
import { StatefulPlugin, StateType } from '@edtr-io/core'

import { createHighlightEditor } from './editor'
import { createIcon, faCode } from '@edtr-io/editor-ui'

export const highlightState = StateType.object({
  text: StateType.string(''),
  language: StateType.string('text'),
  lineNumbers: StateType.boolean(false)
})

import { HighlightRenderer, HighlightRendererProps } from './renderer'

export function createHighlightPluginWithDefault() : StatefulPlugin<typeof highlightState> {
  return createHighlightPlugin({ renderer: HighlightRenderer })
}

export function createHighlightPlugin(config: HighlightPluginConfig) : StatefulPlugin<typeof highlightState> {
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