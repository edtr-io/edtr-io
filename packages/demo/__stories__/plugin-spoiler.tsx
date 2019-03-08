import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Spoiler Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'spoiler'
  }
  return <Story initialState={state} />
})
