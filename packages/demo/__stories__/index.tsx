import {
  createDocumentIdentifier,
  Document,
  EditorProvider,
  Plugin,
  StatefulPlugin
} from '@edtr-io/core'
import { rowsPlugin } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const counterPlugin: StatefulPlugin<{ value: number }> = {
  // eslint-disable-next-line react/display-name
  Component: ({ onChange, state }) => {
    return (
      <div>
        {state.value}
        <button
          onClick={() => {
            onChange({ value: state.value + 1 })
          }}
        >
          +
        </button>
      </div>
    )
  },
  createInitialState: () => {
    return { value: 0 }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: Record<string, Plugin<any>> = {
  counter: counterPlugin,
  rows: rowsPlugin,
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

storiesOf('EditorProvider', module).add('Counter', () => {
  const state = createDocumentIdentifier({
    plugin: 'counter'
  })

  return (
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <Document state={state} />
    </EditorProvider>
  )
})

storiesOf('RowsPlugin', module).add('Basic example', () => {
  const state = createDocumentIdentifier({
    plugin: 'rows'
  })

  return (
    <EditorProvider plugins={plugins} defaultPlugin="counter">
      <Document state={state} />
    </EditorProvider>
  )
})
