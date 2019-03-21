import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Step-By-Step Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'step-by-step'
  }
  return <Story initialState={state} />
})
