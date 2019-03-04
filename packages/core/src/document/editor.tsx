import * as R from 'ramda'
import * as React from 'react'
import { v4 } from 'uuid'

import { EditorContext } from '../editor-context'
import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '../plugin'
import {
  ActionType,
  getDefaultPlugin,
  getDocument,
  getPlugin,
  isFocused
} from '../store'
import { StateDescriptor, StoreDeserializeHelpers } from '../plugin-state'

export const createDocument = (
  options: Partial<Pick<DocumentIdentifier, 'id' | 'plugin' | 'state'>> & {
    type?: '@edtr-io/document'
  } = {}
): DocumentIdentifier => {
  return {
    // $$typeof: '@edtr-io/document',
    id: options.id || v4(),
    plugin: options.plugin,
    state: options.state
  }
}

export const DocumentEditor: React.FunctionComponent<
  DocumentEditorProps
> = props => {
  const container = React.useRef<HTMLDivElement>(null)

  const identifier = props.state || createDocument()
  const { id } = identifier

  const store = React.useContext(EditorContext)

  const deserializeHelpers: StoreDeserializeHelpers = {
    createDocument(document: {
      id: string
      plugin?: string
      state?: unknown
    }): void {
      const plugin = getPlugin(
        store.state,
        document.plugin || getDefaultPlugin(store.state)
      )
      store.dispatch({
        type: ActionType.Insert,
        payload: {
          id: document.id,
          plugin: document.plugin || getDefaultPlugin(store.state),
          ...(plugin && isStatefulPlugin<StateDescriptor<any>>(plugin)
            ? {
                state: document.state
                  ? plugin.state.deserialize(document.state, deserializeHelpers)
                  : plugin.state.createInitialState(deserializeHelpers)
              }
            : {})
        }
      })
    }
  }
  React.useEffect(() => {
    if (!getDocument(store.state, id)) {
      deserializeHelpers.createDocument(identifier)
      store.dispatch({
        type: ActionType.ResetHistory
      })
    }
  }, [identifier, store.state])
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

  let state: unknown
  if (isStatefulPlugin<StateDescriptor<any>>(plugin)) {
    const onChange = (
      updater: (value: unknown, helpers: StoreDeserializeHelpers) => void
    ) => {
      const updated = updater(document.state, deserializeHelpers)
      store.dispatch({
        type: ActionType.Change,
        payload: {
          id,
          state: () => updated
        }
      })
    }
    state = plugin.state(document.state, onChange)
  }
  const Comp = plugin.Component as React.ComponentType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StatefulPluginEditorProps<any> | StatelessPluginEditorProps
  >

  const render = props.render || R.identity
  const focused = isFocused(store.state, id)

  return (
    <React.Fragment>
      {render(
        <div onMouseDown={handleFocus} ref={container} data-document>
          <Comp editable focused={focused} state={state} />
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
  state?: DocumentIdentifier
  id?: string
}

export interface DocumentIdentifier {
  id: string
  plugin?: string
  state?: unknown
}
