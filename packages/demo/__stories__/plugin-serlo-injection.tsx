import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Serlo Injection', module).add('Initial State', () => {
  const state = {
    plugin: 'rows',
    state: [
      {
        plugin: 'serloInjection',
        state: '54210'
      }
    ]
  }
  return <EditorStory initialState={state} />
})
