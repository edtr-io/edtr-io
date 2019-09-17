import { addStory } from '../src'

addStory('Plugins/GeoGebra/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'geogebra'
      }
    ]
  }
})

addStory('Plugins/GeoGebra/Prefilled', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'geogebra',
        state: 'https://www.geogebra.org/m/Hfpaq7jQ'
      }
    ]
  }
})
