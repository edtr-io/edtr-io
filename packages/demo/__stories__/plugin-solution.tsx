import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Solution Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'solution'
  }
  return <Story initialState={state} />
})
