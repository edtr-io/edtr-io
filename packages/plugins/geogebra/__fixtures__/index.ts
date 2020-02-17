import { StateTypeSerializedType } from '@edtr-io/plugin'

import { GeogebraPluginState, createGeogebraPlugin } from '../src'

export const name = 'geogebra'
export const plugin = createGeogebraPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<GeogebraPluginState>
> = {
  simple: 'https://www.geogebra.org/m/Hfpaq7jQ'
}
