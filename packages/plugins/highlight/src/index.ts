import {
  boolean,
  object,
  string,
  EditorPluginProps,
  EditorPlugin,
  ObjectStateType,
  StringStateType,
  BooleanStateType
} from '@edtr-io/plugin'
import * as React from 'react'

import { HighlightEditor } from './editor'
import { HighlightRenderer, HighlightRendererProps } from './renderer'

/** @public */
export type HighlightState = ObjectStateType<{
  code: StringStateType
  language: StringStateType
  showLineNumbers: BooleanStateType
}>
/** @public */
export interface HighlightConfig {
  Renderer: React.ComponentType<HighlightRendererProps>
}
/** @public */
export type HighlightProps = EditorPluginProps<HighlightState, HighlightConfig>

const highlightState: HighlightState = object({
  code: string(''),
  language: string('text'),
  showLineNumbers: boolean(false)
})

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
