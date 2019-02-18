import * as R from 'ramda'
import * as React from 'react'
import { v4 } from 'uuid'

import { EditorContext } from '../editor-context'
import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '../plugin'
import { ActionType, getDocument, getPlugin, isFocused } from '../store'
import { isSerializedDocument } from '.'

export const createDocument = (
  options: Partial<Pick<DocumentIdentifier, 'id' | 'plugin' | 'state'>> & {
    type?: '@edtr-io/document'
  } = {}
): DocumentIdentifier => {
  return {
    $$typeof: '@edtr-io/document',
    id: options.id || v4(),
    plugin: options.plugin,
    state: options.state
  }
}

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
        payload: deserializeDocument(identifier)
      })
    }
  }, [identifier])

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StatefulPluginEditorProps<any> | StatelessPluginEditorProps
  >

  let state: unknown

  if (isStatefulPlugin(plugin)) {
    const onChange = (param: unknown | ((value: unknown) => void)) => {
      let state: unknown
      if (typeof param === 'function') {
        const f = param as ((value: unknown) => void)
        state = f(document.state)
      } else {
        state = param
      }

      store.dispatch({
        type: ActionType.Change,
        payload: {
          id,
          state
        }
      })
    }
    state = plugin.state(document.state, onChange)
  }

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

  function deserializeDocument(
    document: DocumentIdentifier
  ): DocumentIdentifier {
    return {
      ...document,
      state: deserializeState(document.state)
    }

    function deserializeState(pluginState: unknown): unknown {
      if (pluginState instanceof Object) {
        return R.map(
          (value: unknown) => {
            if (isSerializedDocument(value)) {
              const subDocument = createDocument({
                plugin: value.plugin,
                state: deserializeState(value.state)
              })
              store.dispatch({
                type: ActionType.Insert,
                payload: subDocument
              })
              return subDocument
            }

            return deserializeState(value)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pluginState as any
        )
      }

      return pluginState
    }
  }

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
