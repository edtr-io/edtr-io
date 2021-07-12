import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType,
} from '@edtr-io/plugin'

import { SerloInjectionEditor } from './editor'

/**
 * @param config - {@link SerloInjectionConfig | Plugin configuration}
  @public */
export function createSerloInjectionPlugin(
  config: SerloInjectionConfig = {}
): EditorPlugin<SerloInjectionPluginState, SerloInjectionPluginConfig> {
  const { i18n = {} } = config

  return {
    Component: SerloInjectionEditor,
    config: {
      i18n: {
        label: 'Serlo ID',
        placeholder: '123456',
        ...i18n,
      },
    },
    state: string(),
  }
}

/** @public */
export interface SerloInjectionConfig {
  i18n?: Partial<SerloInjectionPluginConfig['i18n']>
}

/** @public */
export type SerloInjectionPluginState = StringStateType

/** @public */
export interface SerloInjectionPluginConfig {
  i18n: {
    label: string
    placeholder: string
  }
}

/** @public */
export type SerloInjectionProps = EditorPluginProps<
  SerloInjectionPluginState,
  SerloInjectionPluginConfig
>
