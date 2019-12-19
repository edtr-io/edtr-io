import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { GeogebraState } from '@edtr-io/plugin-geogebra'

import { render } from '../src'

test('GeoGebra plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<GeogebraState>
  } = {
    plugin: 'geogebra',
    state: 'foo'
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('geogebra')
})
