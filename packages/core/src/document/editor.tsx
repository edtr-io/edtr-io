import * as React from 'react'
import { v4 } from 'uuid'

import { StateActionType } from '../editor-provider/reducer'
import { EditorContext } from '..'

export const DocumentEditor: React.FunctionComponent<
  DocumentEditorProps
> = props => {
  const identifier = props.state
  const { id } = identifier

  const store = React.useContext(EditorContext)

  React.useEffect(() => {
    if (!store.state[id]) {
      store.dispatch({
        type: StateActionType.Insert,
        payload: identifier
      })
    }
  }, [identifier])

  const onChange = React.useCallback(
    (state: unknown) => {
      store.dispatch({
        type: StateActionType.Change,
        payload: {
          id,
          state
        }
      })
    },
    [id]
  )

  if (!store.state[id]) {
    return null
  }

  const plugin = store.registry.getPlugin(store.state[id].plugin)

  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  const Comp = plugin.Component
  return (
    // @ts-ignore
    <Comp
      state={store.state[id].state}
      // @ts-ignore
      onChange={onChange}
    />
  )
}

export interface DocumentEditorProps {
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
