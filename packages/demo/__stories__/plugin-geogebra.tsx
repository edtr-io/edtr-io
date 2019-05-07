import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/GeoGebra', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'geogebra'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
  .add('Prefilled', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'geogebra',
          state: 'https://www.geogebra.org/m/Hfpaq7jQ'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
