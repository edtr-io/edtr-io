import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Video Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'video'
  }
  return <Story initialState={state} />
})
