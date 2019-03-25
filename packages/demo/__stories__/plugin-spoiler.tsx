import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Spoiler', module).add('Initial State', () => {
  const state = {
    plugin: 'spoiler'
  }
  return <EditorStory initialState={state} />
})
