import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Video', module).add('Initial State', () => {
  const state = {
    plugin: 'video'
  }
  return <EditorStory initialState={state} />
})
