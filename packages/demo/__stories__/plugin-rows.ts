import { addStory } from '../src'

addStory('Plugins/Rows/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'text'
      }
    ]
  }
})

addStory('Plugins/Rows/Empty', {
  state: {
    plugin: 'rows',
    state: []
  }
})
