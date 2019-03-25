import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Image', module).add('Initial State', () => {
  const state = {
    plugin: 'image'
  }
  return <EditorStory initialState={state} />
})
