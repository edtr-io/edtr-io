import * as React from 'react'
import * as TestRenderer from 'react-test-renderer'

import {
  EditorContext,
  EditorContextValue,
  EditorProvider
} from '../../src/editor-provider'

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
  expect(actual.state).toEqual({})
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
  actual.dispatch({ type: 'Insert' })
  // @ts-ignore
  expect(Object.keys(actual.state)).toHaveLength(1)
})
