import {
  boolean,
  object,
  string,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'
import * as React from 'react'

import { HighlightEditor } from './editor'
import { HighlightRenderer, HighlightRendererProps } from './renderer'

const highlightState = object({
  text: string(''),
  language: string('text'),
  lineNumbers: boolean(false)
})
export type HighlightState = typeof highlightState
export interface HighlightConfig {
  Renderer: React.ComponentType<HighlightRendererProps>
}
export type HighlightProps = EditorPluginProps<HighlightState, HighlightConfig>

export function createHighlightPlugin(
  config: HighlightConfig = {
    Renderer: HighlightRenderer
  }
): EditorPlugin<HighlightState, HighlightConfig> {
  return {
    Component: HighlightEditor,
    config,
    state: highlightState
  }
}
