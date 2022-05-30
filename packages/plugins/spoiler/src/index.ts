import {
  child,
  ChildStateType,
  ChildStateTypeConfig,
  EditorPlugin,
  EditorPluginProps,
  object,
  ObjectStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'

import { SpoilerEditor } from './editor'

/**
 * @param config - {@link SpoilerConfig | Plugin configuration}
 * @public
 */ export function createSpoilerPlugin(
  config: SpoilerConfig
): EditorPlugin<SpoilerPluginState, SpoilerConfig> {
  const { content } = config

  const titleTextConfig = {
    plugins: {
      code: true,
      colors: false,
      headings: false,
      katex: true,
      links: false,
      lists: false,
      math: true,
      paragraphs: false,
      richText: true,
      suggestions: false,
    },
    noLinebreaks: true,
    blockquote: '',
  }

  return {
    Component: SpoilerEditor,
    config,
    state: object({
      title: child({
        plugin: 'text',
        config: titleTextConfig,
      }),
      content: child(content),
    }),
  }
}

/** @public */
export interface SpoilerConfig {
  content: ChildStateTypeConfig
  i18n?: DeepPartial<SpoilerPluginConfig['i18n']>
  theme?: Partial<SpoilerPluginConfig['theme']>
}

/** @public */
export type SpoilerPluginState = ObjectStateType<{
  title: ChildStateType
  content: ChildStateType
}>

/** @public */
export interface SpoilerPluginConfig {
  i18n: {
    title: {
      placeholder: string
    }
  }
  theme: {
    color: string
  }
}

/** @public */
export type SpoilerProps = EditorPluginProps<SpoilerPluginState, SpoilerConfig>
