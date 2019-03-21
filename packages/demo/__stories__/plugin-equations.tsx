import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Equations', module).add('Initial State', () => {
  const state = {
    plugin: 'equations'
  }
  return <EditorStory initialState={state} />
})
