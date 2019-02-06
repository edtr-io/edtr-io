import * as R from 'ramda'
import * as React from 'react'
import { v4 } from 'uuid'

import { EditorContext, PluginEditorProps } from '..'
import { ActionType, getDocument, getPlugin, isFocused } from '../store'

export const DocumentEditor: React.FunctionComponent<
  DocumentEditorProps
> = props => {
  const container = React.useRef<HTMLDivElement>(null)

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

  const Comp = plugin.Component as React.ComponentType<
    PluginEditorProps<unknown>
  >

  const render = props.render || R.identity
  const focused = isFocused(store.state, id)

  return (
    <React.Fragment>
      {render(
        <div onMouseDown={handleFocus} ref={container} data-document>
          <Comp focused={focused} state={document.state} onChange={onChange} />
        </div>
      )}
    </React.Fragment>
  )

  function handleFocus(e: React.MouseEvent<HTMLDivElement>) {
    // Find closest document
    const target = (e.target as HTMLDivElement).closest('[data-document]')

    if (!focused && target === container.current) {
      store.dispatch({
        type: ActionType.Focus,
        payload: id
      })
    }
  }
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
