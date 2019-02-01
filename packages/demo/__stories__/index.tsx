import { EditorProvider, Plugin, StatefulPlugin } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Document, createDocumentIdentifier } from '@edtr-io/core'
import {rowsPlugin} from "../../ui/src/plugin-rows";

const counterPlugin: StatefulPlugin<{ value: number }> = {
  Component: ({ onChange, state }) => {
    console.log(state)
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
  const state = createDocumentIdentifier()

  return (
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <Document defaultPlugin="counter" state={state} />
    </EditorProvider>
  )
})

storiesOf('RowsPlugin', module).add('Basic example', () => {
  const state = createDocumentIdentifier()

  return (
    <EditorProvider plugins={plugins} defaultPlugin="counter">
      <Document defaultPlugin="rows" state={state}/>
    </EditorProvider>
  )
})