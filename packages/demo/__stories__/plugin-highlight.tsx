import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Highlight', module).add('Initial State', () => {
  const state = {
    plugin: 'highlight'
  }
  return <EditorStory initialState={state} />
})
