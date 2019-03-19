import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Injection Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'injection'
  }
  return <Story initialState={state} />
})
