import { addStory } from '../src'

addStory('Plugins/Terminator/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'terminator',
        state: { catalog: 'kopfeasy', size: 3, addition: 1, subtraction: 1 }
      }
    ]
  }
})
