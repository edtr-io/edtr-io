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

/** @public */
export const highlightState = object({
  text: string(''),
  language: string('text'),
  lineNumbers: boolean(false)
})
/** @public */
export type HighlightState = typeof highlightState
/** @public */
export interface HighlightConfig {
  Renderer: React.ComponentType<HighlightRendererProps>
}
/** @public */
export type HighlightProps = EditorPluginProps<HighlightState, HighlightConfig>

/**
 * @param config - {@link HighlightConfig | Plugin configuration}
 * @public
 */
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

export { HighlightRendererProps }
