import { StatefulPlugin, StateType } from '@edtr-io/core'

import { GeogebraEditor } from './editor'

export const geogebraState = StateType.string()
export const geogebraPlugin: StatefulPlugin<typeof geogebraState> = {
  Component: GeogebraEditor,
  state: geogebraState
}
