import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Highlight', module)
  .add('Initial State', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"highlight","state":{"text":"","language":"text","lineNumbers":false}}]}'
    )
    return <EditorStory initialState={state} />
  })
  .add('Prefilled Example', () => {
    const state = JSON.parse(
      '{"plugin":"rows","state":[{"plugin":"highlight","state":{"text":"import { storiesOf } from \'@storybook/react\'\\nimport * as React from \'react\'\\n\\nimport { EditorStory } from \'../src\'\\n\\nstoriesOf(\'Plugins/Highlight\', module).add(\'Initial State\', () => {\\n  const state = JSON.parse(\\n    \'{\\"plugin\\":\\"rows\\",\\"state\\":[{\\"plugin\\":\\"highlight\\",\\"state\\":{\\"text\\":\\"\\",\\"language\\":\\"text\\",\\"lineNumbers\\":false}}]}\'\\n  )\\n  return <EditorStory initialState={state} />\\n})","language":"javascript","lineNumbers":false}}]}'
    )

    return <EditorStory defaultPlugin="text" initialState={state} />
  })
