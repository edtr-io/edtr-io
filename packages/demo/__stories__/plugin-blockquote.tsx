import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Blockquote', module).add('Initial State', () => {
  const state = {
    plugin: 'blockquote'
  }
  return <EditorStory initialState={state} />
})
