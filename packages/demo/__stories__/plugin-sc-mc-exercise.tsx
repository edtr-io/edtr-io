import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Sc-Mc-Exercise Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'scMcExercise'
  }
  return <Story initialState={state} />
})
