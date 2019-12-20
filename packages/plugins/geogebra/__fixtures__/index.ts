import { StateTypeSerializedType } from '@edtr-io/plugin'

import { GeogebraState, createGeogebraPlugin } from '../src'

export const name = 'geogebra'
export const plugin = createGeogebraPlugin()

export const states: Record<string, StateTypeSerializedType<GeogebraState>> = {
  simple: 'https://www.geogebra.org/m/Hfpaq7jQ'
}
