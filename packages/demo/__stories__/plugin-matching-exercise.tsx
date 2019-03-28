import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Matching-Exercise Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'matchingExercise'
  }
  return <Story initialState={state} />
})
