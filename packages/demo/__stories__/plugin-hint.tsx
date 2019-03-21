import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Hint Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'hint'
  }
  return <Story initialState={state} />
})
