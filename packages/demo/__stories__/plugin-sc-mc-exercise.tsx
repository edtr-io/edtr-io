import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Single-Choice-Multiple-Choice Exercise', module).add(
  'Initial State',
  () => {
    const state = {
      plugin: 'scMcExercise'
    }
    return <EditorStory initialState={state} />
  }
)
