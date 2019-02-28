import { createDocument } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Spoiler Plugin', module).add('Initial State', () => {
  const state = createDocument({
    plugin: 'spoiler'
  })
  return <Story state={state} />
})
