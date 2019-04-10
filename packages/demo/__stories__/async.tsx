import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Async', module).add('Initial State', () => {
  const state = {
    plugin: 'counter'
  }
  return <EditorStory initialState={state} />
})
