import * as React from 'react'
import * as TestRenderer from 'react-test-renderer'

import {
  createDocumentIdentifier,
  Document,
  EditorProvider,
  Plugin,
  StatefulPlugin
} from '../../src'

const counterPlugin: StatefulPlugin<{ value: number }> = {
  // eslint-disable-next-line react/display-name
  Component: ({ state }) => <div>{state.value}</div>,
  createInitialState: () => {
    return { value: 0 }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: Record<string, Plugin<any>> = {
  counter: counterPlugin
}

// TODO:
test.skip('default plugin', () => {
  const state = createDocumentIdentifier()

  TestRenderer.create(
    <EditorProvider plugins={plugins} defaultPlugin="counter">
      <Document state={state} />
    </EditorProvider>
  )
})
