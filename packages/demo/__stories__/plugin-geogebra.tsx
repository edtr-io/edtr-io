import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Geogebra Plugin', module).add('Initial State', () => {
  const state = {
    plugin: 'geogebra'
  }
  return <Story initialState={state} />
})
