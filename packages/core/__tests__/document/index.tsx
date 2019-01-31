import {
  createDocumentIdentifier,
  Document,
  EditorProvider,
  Plugin,
  StatefulPlugin
} from '../../src'
import * as React from 'react'
import * as TestRenderer from 'react-test-renderer'

const counterPlugin: StatefulPlugin<{ value: number }> = {
  Component: ({ state }) => <div>{state.value}</div>,
  createInitialState: () => {
    return { value: 0 }
  }
}

const plugins: Record<string, Plugin<any>> = {
  counter: counterPlugin
}

// TODO:
test.skip('default plugin', () => {
  const state = createDocumentIdentifier()

  TestRenderer.create(
    <EditorProvider plugins={plugins} defaultPlugin="counter">
      <Document state={state}/>
    </EditorProvider>
  )
})

