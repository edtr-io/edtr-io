import * as R from 'ramda'
import * as React from 'react'
import { v4 } from 'uuid'

import { EditorContext } from '../editor-context'
import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '../plugin'
import { Action, ActionType, getDocument, getPlugin, isFocused } from '../store'
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
      const plugin = getPlugin(
        store.state,
        identifier.plugin || store.state.defaultPlugin
      )

      if (plugin && isStatefulPlugin(plugin)) {
        const state = plugin.state(
          deserializeDocument(identifier).state,
          undefined,
          () => {}
        )

        store.dispatch({
          type: ActionType.Insert,
          payload: {
            ...identifier,
            plugin: identifier.plugin || store.state.defaultPlugin,
            state: state.$$value
          }
        })
        R.forEach(store.dispatch, state.$$insert())
      } else {
        store.dispatch({
          type: ActionType.Insert,
          payload: {
            ...identifier,
            plugin: identifier.plugin || store.state.defaultPlugin
          }
        })
      }
    }
  }, [identifier])
  const document = getDocument(store.state, id)
  const [pluginState, setPluginState] = React.useState(null)

  React.useEffect(() => {
    if (document) {
      const plugin = getPlugin(store.state, document.plugin)

      if (plugin && isStatefulPlugin(plugin)) {
        const onChange = (param: unknown | ((value: unknown) => void)) => {
          let stateHandler: (value: unknown) => unknown
          if (typeof param === 'function') {
            stateHandler = param as ((value: unknown) => unknown)
          } else {
            stateHandler = () => param
          }

          store.dispatch({
            type: ActionType.Change,
            payload: {
              id,
              state: stateHandler
            }
          })
        }
        const dispatch = (actions: Action[]) => {
          R.forEach(store.dispatch, actions)
        }
        setPluginState(
          plugin.state(identifier.state, document.state, onChange, dispatch)
        )
      }
    }
  }, [identifier.state, document, store.state])

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

  const render = props.render || R.identity
  const focused = isFocused(store.state, id)

  if (!pluginState) {
    return null
  }

  return (
    <React.Fragment>
      {render(
        <div onMouseDown={handleFocus} ref={container} data-document>
          <Comp editable focused={focused} state={pluginState} />
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
