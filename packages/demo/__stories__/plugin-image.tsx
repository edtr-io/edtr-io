import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Image', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'image'
    }
    return <EditorStory initialState={state} />
  })
  .add('Prefilled', () => {
    const state = {
      plugin: 'image',
      state: {
        src:
          'https://packages.serlo.org/athene2-assets@a/serlo_learning_lg.ee37b05f.jpg',
        href: '',
        target: '',
        rel: '',
        description: 'Ein Schüler lernt mit serlo.org',
        maxWidth: 0
      }
    }
    return <EditorStory initialState={state} />
  })
