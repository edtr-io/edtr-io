import { addStory } from '../src'

addStory('Plugins/Table/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'table'
      }
    ]
  }
})

addStory('Plugins/Table/Prefilled', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'table',
        state: `| col1 | col2 |
          | ------ | ----------- |
          | ex1 | longer text than the rest |
          | some more lines | |
          | empty second |`
      }
    ]
  }
})
