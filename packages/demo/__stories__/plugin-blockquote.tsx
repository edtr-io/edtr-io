import { createDocument } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Story } from '.'

storiesOf('Blockquote Plugin', module).add('Initial State', () => {
  const state = createDocument({
    plugin: 'blockquote'
  })
  return <Story state={state} />
})
