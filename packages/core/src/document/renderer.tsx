import * as React from 'react'

import { EditorContext } from '../editor-context'
import { getPlugin, PluginState } from '../store'

export const DocumentRenderer: React.FunctionComponent<
  DocumentRendererProps
> = props => {
  const store = React.useContext(EditorContext)

  const plugin = getPlugin(store.state, props.state.plugin)

  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  return (
    // @ts-ignore
    <plugin.Component state={props.state.state} />
  )
}

export interface DocumentRendererProps {
  state: SerializedDocument
}

export interface SerializedDocument extends PluginState {
  type: '@edtr-io/document'
}
