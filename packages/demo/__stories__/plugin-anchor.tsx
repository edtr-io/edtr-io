import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Anchor Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'anchor'
  }
  return <Story initialState={state} />
})
