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

addStory('Plugins/Rows/Custom', {
  state: {
    plugin: 'customRows',
    state: [
      {
        plugin: 'text'
      }
    ]
  }
})
