import { addStory } from '../src'

addStory('Plugins/Highlight/Initial State', {
  state: {
    plugin: 'rows',
    state: [
      {
        plugin: 'highlight'
      }
    ]
  }
})

addStory('Plugins/Highlight/Prefilled', {
  state: JSON.parse(
    '{"plugin":"rows","state":[{"plugin":"highlight","state":{"text":"import { storiesOf } from \'@storybook/react\'\\nimport * as React from \'react\'\\n\\nimport { EditorStory } from \'../src\'\\n\\nstoriesOf(\'Plugins/Highlight\', module).add(\'Initial State\', () => {\\n  const state = JSON.parse(\\n    \'{\\"plugin\\":\\"rows\\",\\"state\\":[{\\"plugin\\":\\"highlight\\",\\"state\\":{\\"text\\":\\"\\",\\"language\\":\\"text\\",\\"lineNumbers\\":false}}]}\'\\n  )\\n  return <EditorStory initialState={state} />\\n})","language":"javascript","lineNumbers":false}}]}'
  )
})
