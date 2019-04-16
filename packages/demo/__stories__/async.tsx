import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'
import { StatefulPluginEditorProps, StateType } from '@edtr-io/core'

const asyncState = StateType.async(
  StateType.string('Waiting for async state... (should take 3 seconds)'),
  new Promise(resolve => {
    setTimeout(() => {
      resolve('Async initial state completed')
    }, 3000)
  })
)
const AsyncRenderer = (props: StatefulPluginEditorProps<typeof asyncState>) => {
  return <div>{props.state()}</div>
}
const asyncPlugin = {
  Component: AsyncRenderer,
  state: asyncState
}

storiesOf('Async/Basic', module).add('Initial State', () => {
  const state = {
    plugin: 'async'
  }
  return <EditorStory plugins={{ async: asyncPlugin }} initialState={state} />
})
