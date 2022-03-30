import {
  boolean,
  BooleanStateType,
  EditorPlugin,
  EditorPluginProps,
  object,
  ObjectStateType,
  string,
  StringStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as React from 'react'

import { HighlightEditor } from './editor'
import type { HighlightRendererProps } from './renderer'

/**
 * @param config - {@link HighlightConfig | Plugin configuration}
 * @public
 */
export function createHighlightPlugin(
  config: HighlightConfig = {}
): EditorPlugin<HighlightPluginState, HighlightConfig> {
  return {
    Component: HighlightEditor,
    config,
    state: object({
      code: string(''),
      language: string('text'),
      showLineNumbers: boolean(false),
    }),
  }
}

/** @public */
export interface HighlightConfig {
  Renderer?: HighlightPluginConfig['Renderer']
  i18n?: DeepPartial<HighlightPluginConfig['i18n']>
}

/** @public */
export type HighlightPluginState = ObjectStateType<{
  code: StringStateType
  language: StringStateType
  showLineNumbers: BooleanStateType
}>

/** @public */
export interface HighlightPluginConfig {
  Renderer: React.ComponentType<HighlightRendererProps>
  i18n: {
    code: {
      label: string
      placeholder: string
    }
    language: {
      label: string
      placeholder: string
    }
    showLineNumbers: {
      label: string
    }
  }
}
export { HighlightRendererProps }

/** @public */
export type HighlightProps = EditorPluginProps<
  HighlightPluginState,
  HighlightConfig
>
