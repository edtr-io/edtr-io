import { createDocument } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Highlight Plugin', module).add('Initial State', () => {
  const state = createDocument({
    plugin: 'highlight'
  })
  return <Story state={state} />
})
