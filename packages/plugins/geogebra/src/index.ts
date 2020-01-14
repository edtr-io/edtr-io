import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'

import { GeogebraEditor } from './editor'

/** @public */
export const geogebraState = string()
/** @public */
export type GeogebraState = typeof geogebraState
/** @public */
export type GeogebraProps = EditorPluginProps<GeogebraState>

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
