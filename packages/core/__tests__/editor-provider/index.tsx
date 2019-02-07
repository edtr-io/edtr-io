import * as React from 'react'
import * as TestRenderer from 'react-test-renderer'

import {
  EditorContext,
  EditorContextValue,
  EditorProvider
} from '../../src/editor-provider'
import { ActionType, getDocument } from '../../src/store'

export const plugins = {
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

test('initialized EditorContext', () => {
  let actual: EditorContextValue
  TestRenderer.create(
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <EditorContext.Consumer>
        {value => {
          actual = value
          return null
        }}
      </EditorContext.Consumer>
    </EditorProvider>
  )

  // @ts-ignore
  expect(actual.state).toBeDefined()
  // @ts-ignore
  expect(actual.dispatch).toBeDefined()
})

test('initialized EditorContext', () => {
  let actual: EditorContextValue
  TestRenderer.create(
    <EditorProvider plugins={plugins} defaultPlugin="stateless">
      <EditorContext.Consumer>
        {value => {
          actual = value
          return null
        }}
      </EditorContext.Consumer>
    </EditorProvider>
  )

  // @ts-ignore
  actual.dispatch({ type: ActionType.Insert, payload: { id: '0' } })
  // @ts-ignore
  expect(Object.keys(getDocument(actual.state, '0'))).toBeDefined()
})
