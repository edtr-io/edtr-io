import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType,
} from '@edtr-io/plugin'

import { GeogebraEditor } from './editor'

/**
 * @param config - {@link GeogebraConfig | Plugin configuration}
 * @public
 */
export function createGeogebraPlugin(
  config: GeogebraConfig = {}
): EditorPlugin<GeogebraPluginState, GeogebraConfig> {
  return {
    Component: GeogebraEditor,
    config,
    state: string(),
    onText(value) {
      if (/geogebra\.org\/m\/(.+)/.test(value)) {
        return { state: value }
      }
    },
  }
}

/** @public */
export interface GeogebraConfig {
  i18n?: Partial<GeogebraPluginConfig['i18n']>
}

/** @public */
export type GeogebraPluginState = StringStateType

/** @public */
export interface GeogebraPluginConfig {
  i18n: {
    label: string
    placeholder: string
  }
}

/** @public */
export type GeogebraProps = EditorPluginProps<
  GeogebraPluginState,
  GeogebraConfig
>
