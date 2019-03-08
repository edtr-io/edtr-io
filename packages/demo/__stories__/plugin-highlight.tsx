import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Highlight Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'highlight'
  }
  return <Story initialState={state} />
})
