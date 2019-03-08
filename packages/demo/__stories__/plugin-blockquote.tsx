import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Blockquote Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'blockquote'
  }
  return <Story initialState={state} />
})
