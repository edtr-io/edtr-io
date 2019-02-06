import * as R from 'ramda'
import * as React from 'react'
import { v4 } from 'uuid'

import { EditorContext } from '..'
import { ActionType, getDocument, getPlugin } from '../store'

export const DocumentEditor: React.FunctionComponent<
  DocumentEditorProps
> = props => {
  const identifier = props.state
  const { id } = identifier

  const store = React.useContext(EditorContext)

  React.useEffect(() => {
    if (!getDocument(store.state, id)) {
      store.dispatch({
        type: ActionType.Insert,
        payload: identifier
      })
    }
  }, [identifier])

  const onChange = React.useCallback(
    (state: unknown) => {
      store.dispatch({
        type: ActionType.Change,
        payload: {
          id,
          state
        }
      })
    },
    [id]
  )

  const document = getDocument(store.state, id)

  if (!document) {
    return null
  }

  const plugin = getPlugin(store.state, document.plugin)

  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  const Comp = plugin.Component

  const render = props.render || R.identity

  return (
    <React.Fragment>
      {render(
        // @ts-ignore
        <Comp
          state={document.state}
          // @ts-ignore
          onChange={onChange}
        />
      )}
    </React.Fragment>
  )
}

export interface DocumentEditorProps {
  render?: (children: React.ReactNode) => React.ReactNode
  state: DocumentIdentifier
}

export interface DocumentIdentifier {
  $$typeof: '@edtr-io/document'
  id: string
  plugin?: string
  state?: unknown
}

export const createDocumentIdentifier = (
  options: Partial<Pick<DocumentIdentifier, 'id' | 'plugin' | 'state'>> = {}
): DocumentIdentifier => {
  return {
    $$typeof: '@edtr-io/document',
    id: options.id || v4(),
    plugin: options.plugin,
    state: options.state
  }
}
