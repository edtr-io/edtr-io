import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { plugins } from '../__fixtures__/plugins'
import { getDocument } from '../src/store'
import { createStore, EditorProvider } from '../src/editor'
import { Provider } from 'react-redux'
import { Store } from 'redux'

let container: Element

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

test('default plugin', () => {
  const state = undefined
  const store = createStore(plugins, 'stateless', true)
  renderDocument(store, state)

  const document = getDocument(store.getState(), 'root')

  if (!document) {
    throw new Error('document not found')
  }

  expect(document.plugin).toEqual('stateless')
})

function renderDocument(
  store: Store,
  state?: { plugin: string; state?: unknown }
) {
  act(() => {
    ReactDOM.render(
      <Provider store={store}>
        <EditorProvider initialState={state} theme={{}} />
      </Provider>,
      container
    )
  })
}
