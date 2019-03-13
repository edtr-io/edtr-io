import { StatefulPlugin, StateType } from '@edtr-io/core'

import { GeogebraEditor } from './editor'

export const geogebraState = StateType.string()
export const geogebraPlugin: StatefulPlugin<typeof geogebraState> = {
  Component: GeogebraEditor,
  state: geogebraState,
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    const match = value.match(/geogebra\.org\/m\/(.+)/)
    if (match) {
      return { state: match[1] }
    }
  }
}
