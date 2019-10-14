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
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"video","state":{"__version__":1,"value":{"src":"https://www.youtube.com/watch?v=SCJ7nzKwnYo","alt":"Regenwürmer als Haustiere"}}}]}'
  )
})
