import { plugins } from '@edtr-io/internal__fixtures'
import { DocumentState, serializeRootDocument } from '@edtr-io/store'
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'

import { Editor, useScopedSelector } from '../src'

test.todo('fix these tests')

let root: ReactDOMClient.Root

beforeEach(() => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  root = ReactDOMClient.createRoot(container)
})

test('default plugin', () => {
  renderDocument((document) => {
    if (!document) throw new Error('No document found')
    expect(document.plugin).toEqual('stateful')
  })
})

function renderDocument(onChange: StateProps['onChange']) {
  root.render(
    <Editor plugins={plugins} initialState={{ plugin: 'stateful' }}>
      {(children) => {
        return (
          <React.Fragment>
            {children}
            <State onChange={onChange} />
          </React.Fragment>
        )
      }}
    </Editor>
  )
}

function State({ onChange }: StateProps) {
  const serialized = useScopedSelector(serializeRootDocument())
  React.useEffect(() => {
    onChange(serialized)
  })

  return null
}

interface StateProps {
  onChange: (document: DocumentState | null) => void
}
