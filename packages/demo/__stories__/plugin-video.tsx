import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Video', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'video'
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
          plugin: 'video',
          state: 'https://www.youtube.com/watch?v=SCJ7nzKwnYo'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
