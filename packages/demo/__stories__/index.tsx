import {
  createDocumentIdentifier,
  Document,
  EditorContext,
  EditorProvider,
  Plugin,
  StatefulPlugin,
  serializeDocument,
  DocumentIdentifier
} from '@edtr-io/core'
import { rowsPlugin } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const counterPlugin: StatefulPlugin<{ value: number }> = {
  // eslint-disable-next-line react/display-name
  Component: ({ focused, onChange, state }) => {
    return (
      <div
        style={{
          outline: focused ? '1px solid blue' : 'none'
        }}
      >
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

// TODO: stringify correctly
storiesOf('EditorProvider', module).add('Counter', () => {
  const state = createDocumentIdentifier({
    plugin: 'counter'
  })

  return (
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <Document state={state} />
      <LogState state={state} />
    </EditorProvider>
  )
})

storiesOf('RowsPlugin', module).add('Basic example', () => {
  const state = createDocumentIdentifier(
    JSON.parse(
      '{"type":"@edtr-io/document","plugin":"rows","state":{"rows":[{"type":"@edtr-io/document","plugin":"counter","state":{"value":1}},{"type":"@edtr-io/document","plugin":"counter","state":{"value":2}},{"type":"@edtr-io/document","plugin":"counter","state":{"value":3}}]}}'
    )
  )

  return (
    <EditorProvider plugins={plugins} defaultPlugin="counter">
      <Document state={state} />
      <LogState state={state} />
    </EditorProvider>
  )
})

function LogState({ state }: { state: DocumentIdentifier }) {
  return (
    <EditorContext.Consumer>
      {store => {
        return (
          <button
            onClick={() => {
              const serialized = serializeDocument(store.state, state.id)
              const stringified = JSON.stringify({
                state: JSON.stringify(serialized)
              })
              // eslint-disable-next-line no-console
              console.log(stringified.substr(9, stringified.length - 9 - 1))
            }}
          >
            Log State
          </button>
        )
      }}
    </EditorContext.Consumer>
  )
}
