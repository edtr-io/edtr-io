import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Plugins/Table', module)
  .add('Initial State', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'table'
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
  .add('Example', () => {
    const state = {
      plugin: 'rows',
      state: [
        {
          plugin: 'table',
          state: `| col1 | col2 |
          | ------ | ----------- |
          | ex1 | longer text than the rest |
          | some more lines | |
          | empty second |`
        }
      ]
    }
    return <EditorStory initialState={state} />
  })
