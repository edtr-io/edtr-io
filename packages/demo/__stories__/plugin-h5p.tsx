import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/H5p', module).add('Initial State', () => {
  const state = {
    plugin: 'h5p'
  }
  return <EditorStory initialState={state} />
})
