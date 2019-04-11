import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Rows', module).add('Initial State', () => {
  const state = {
    plugin: 'rows'
  }

  return <EditorStory initialState={state} />
})
