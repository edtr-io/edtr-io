import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType
} from '@edtr-io/plugin'

import { GeogebraEditor } from './editor'

/** @public */
export type GeogebraState = StringStateType
/** @public */
export type GeogebraProps = EditorPluginProps<GeogebraState>

const geogebraState: GeogebraState = string()

/** @public */
export function createGeogebraPlugin(): EditorPlugin<GeogebraState> {
  return {
    Component: GeogebraEditor,
    config: {},
    state: geogebraState,
    onPaste(clipboardData: DataTransfer) {
      const value = clipboardData.getData('text')

      if (/geogebra\.org\/m\/(.+)/.test(value)) {
        return { state: value }
      }
    }
  }
}
