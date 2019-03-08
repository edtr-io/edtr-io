import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { plugins } from '../__fixtures__/plugins'
import { EditorContext, EditorContextValue, Editor } from '../src'
import { getDocument } from '../src/store'

let container: Element
let store: EditorContextValue

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

test('default plugin', () => {
  const state = undefined
  renderDocument(state)

  const document = getDocument(store.state, 'root')

  if (!document) {
    throw new Error('document not found')
  }

  expect(document.plugin).toEqual('stateless')
})

function renderDocument(state?: { plugin: string; state?: unknown }) {
  act(() => {
    ReactDOM.render(
      <Editor plugins={plugins} defaultPlugin="stateless" initialState={state}>
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
