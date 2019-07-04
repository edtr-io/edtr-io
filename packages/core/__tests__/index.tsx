import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'

import { plugins } from '../__fixtures__/plugins'
import { DocumentState, Editor, selectors, useStore } from '../src'

test.todo('fix these tests')

let container: Element

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

test('default plugin', () => {
  renderDocument(document => {
    if (!document) throw new Error('No document found')
    expect(document.plugin).toEqual('stateless')
  })
})

function renderDocument(onChange: StateProps['onChange']) {
  act(() => {
    ReactDOM.render(
      <Editor plugins={plugins} defaultPlugin="stateless">
        {children => {
          return (
            <React.Fragment>
              {children}
              <State onChange={onChange}></State>
            </React.Fragment>
          )
        }}
      </Editor>,
      container
    )
  })
}

function State({ onChange }: StateProps) {
  const store = useStore()
  React.useEffect(() => {
    const serialized = selectors.serializeRootDocument(store.getState())
    onChange(serialized)
  })

  return null
}

interface StateProps {
  onChange: (document: DocumentState | null) => void
}
