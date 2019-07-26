import { addStory } from '../src'

addStory('Plugins/Video/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'video'
      }
    ]
  }
})

addStory('Plugins/Video/Prefilled', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'video',
        state: 'https://www.youtube.com/watch?v=SCJ7nzKwnYo'
      }
    ]
  }
})
