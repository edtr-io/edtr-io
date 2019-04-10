import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Solution', module).add('Initial State', () => {
  const state = {
    plugin: 'solution'
  }
  return <EditorStory initialState={state} />
})
