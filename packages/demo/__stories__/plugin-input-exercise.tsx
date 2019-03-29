import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Input Exercise', module).add('Initial State', () => {
  const state = {
    plugin: 'inputExercise'
  }
  return <EditorStory initialState={state} />
})
