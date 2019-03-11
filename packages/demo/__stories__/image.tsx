import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Image Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'image'
  }
  return <Story initialState={state} />
})
