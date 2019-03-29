import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Injection', module).add('Initial State', () => {
  const state = {
    plugin: 'injection'
  }

  return <EditorStory initialState={state} />
})
