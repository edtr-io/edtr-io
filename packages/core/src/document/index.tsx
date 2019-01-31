import * as React from 'react'
import { PluginState, StateActionType } from '../editor-provider/reducer'
import { EditorContext } from '@edtr-io/core'
import { v4 } from 'uuid'

export interface DocumentProps {
  initialState?: PluginState
  defaultPlugin?: string
  state: DocumentIdentifier | SerializedDocument
}

export interface DocumentIdentifier {
  $$typeof: '@edtr-io/document'
  id: string
}

export interface SerializedDocument {
  type: '@edtr-io/document'
  state: PluginState
}

const isDocumentIdentifier = (
  state: DocumentIdentifier | SerializedDocument
): state is DocumentIdentifier => {
  return typeof (state as DocumentIdentifier).$$typeof !== 'undefined'
}

export const Document: React.FunctionComponent<DocumentProps> = props => {
  const { state, dispatch, registry } = React.useContext(EditorContext)
  console.log('foo', state)

  React.useEffect(() => {
    if (isDocumentIdentifier(props.state) && !state[props.state.id]) {
      dispatch({
        type: StateActionType.Insert,
        payload: {
          id: props.state.id,
          type: props.defaultPlugin
        }
      })
    }
  }, [props.state])

  if (isDocumentIdentifier(props.state)) {
    const { id } = props.state
    console.log('bar', state, id)
    if (!state[id]) {
      return null
    }
    const plugin = registry.getPlugin(state[id].type)

    if (!plugin) {
      // TODO:
      console.log('plugin not existing')
      return null
    }

    const Comp = plugin.Component
    // @ts-ignore
    return (
      <Comp
        state={state[id].state}
        onChange={change => {
          dispatch({
            type: StateActionType.Change,
            payload: {
              id,
              state: change
            }
          })
        }}
      />
    )
  }

  return null
}

export const createDocumentIdentifier = (): DocumentIdentifier => {
  return {
    $$typeof: '@edtr-io/document',
    id: v4()
  }
}
