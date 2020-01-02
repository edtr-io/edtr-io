import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'

import { GeogebraEditor } from './editor'

const geogebraState = string()
export type GeogebraState = typeof geogebraState
export type GeogebraProps = EditorPluginProps<GeogebraState>

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
