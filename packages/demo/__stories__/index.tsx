import { foo } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

storiesOf('Foo', module).add('Bar', () => {
  return <div>{foo}</div>
})
