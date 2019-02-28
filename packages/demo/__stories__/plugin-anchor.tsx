import { createDocument } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Anchor Plugin', module).add('Initial State', () => {
  const state = createDocument({
    plugin: 'anchor'
  })
  return <Story state={state} />
})
