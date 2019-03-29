import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Hint', module).add('Initial State', () => {
  const state = {
    plugin: 'hint'
  }
  return <EditorStory initialState={state} />
})
