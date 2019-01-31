import {EditorContext, EditorProvider} from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const plugins = {
  stateless: {
    Component: () => null
  },
  stateful: {
    Component: () => null,
    createInitialState: () => {
      return { counter: 0 }
    }
  }
}

storiesOf('EditorProvider', module).add('foo', () => {
  return (
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <EditorContext.Consumer>
        {({ state }) => {
          return JSON.stringify(state)
        }}
      </EditorContext.Consumer>
    </EditorProvider>
  )
})
