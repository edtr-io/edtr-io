import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/GeoGebra', module).add('Initial State', () => {
  const state = {
    plugin: 'geogebra'
  }
  return <EditorStory initialState={state} />
})
