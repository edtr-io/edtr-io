import { StatefulPlugin, string } from '@edtr-io/plugin'
import { createIcon, faCubes } from '@edtr-io/ui'

import { GeogebraEditor } from './editor'

export const geogebraState = string()

export function createGeogebraPlugin(): StatefulPlugin<typeof geogebraState> {
  return {
    Component: GeogebraEditor,
    config: {},
    state: geogebraState,
    title: 'Geogebra Applet',
    description: 'Binde Applets von Geogebratube via Link oder ID ein.',
    icon: createIcon(faCubes),
    onPaste(clipboardData: DataTransfer) {
      const value = clipboardData.getData('text')

      if (/geogebra\.org\/m\/(.+)/.test(value)) {
        return { state: value }
      }
    }
  }
}
