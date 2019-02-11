import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { plugins } from '../__fixtures__/plugins'
import {
  createDocument,
  DocumentIdentifier,
  EditorContext,
  EditorContextValue,
  Editor
} from '../src'
import { getDocument } from '../src/store'

let container: Element
let store: EditorContextValue

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

test('default plugin', () => {
  const state = createDocument()
  renderDocument(state)

  const document = getDocument(store.state, state.id)

  if (!document) {
    throw new Error('document not found')
  }

  expect(document.plugin).toEqual('stateless')
})

test('deserialize nested', () => {
  const state = createDocument({
    type: '@edtr-io/document',
    plugin: 'nested',
    state: {
      child: {
        type: '@edtr-io/document',
        plugin: 'stateful',
        state: { counter: 0 }
      }
    }
  })

  renderDocument(state)

  const document = getDocument(store.state, state.id)

  if (!document) {
    throw new Error('document not found')
  }

  expect(document.plugin).toEqual('nested')

  const { child } = document.state as { child: DocumentIdentifier }

  const subDocument = getDocument(store.state, child.id)

  if (!subDocument) {
    throw new Error('document not found')
  }

  expect(subDocument.plugin).toEqual('stateful')
  expect(subDocument.state).toEqual({ counter: 0 })
})

test('deserialize nested array', () => {
  const state = createDocument({
    type: '@edtr-io/document',
    plugin: 'nestedArray',
    state: {
      children: [
        {
          type: '@edtr-io/document',
          plugin: 'stateful',
          state: { counter: 0 }
        }
      ]
    }
  })

  renderDocument(state)

  const document = getDocument(store.state, state.id)

  if (!document) {
    throw new Error('document not found')
  }

  expect(document.plugin).toEqual('nestedArray')

  const [child] = (document.state as {
    children: DocumentIdentifier[]
  }).children

  const subDocument = getDocument(store.state, child.id)

  if (!subDocument) {
    throw new Error('document not found')
  }

  expect(subDocument.plugin).toEqual('stateful')
  expect(subDocument.state).toEqual({ counter: 0 })
})

function renderDocument(state: DocumentIdentifier) {
  act(() => {
    ReactDOM.render(
      <Editor plugins={plugins} defaultPlugin="stateless" state={state}>
        {setStore()}
      </Editor>,
      container
    )
  })
}

function setStore() {
  return (
    <EditorContext.Consumer>
      {s => {
        store = s
        return null
      }}
    </EditorContext.Consumer>
  )
}
