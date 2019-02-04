import * as React from 'react'

import { PluginState } from '../editor-provider/reducer'
import { EditorContext } from '..'

export const DocumentRenderer: React.FunctionComponent<
  DocumentRendererProps
> = props => {
  const store = React.useContext(EditorContext)

  const plugin = store.registry.getPlugin(props.state.plugin)

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

export interface SerializedDocument {
  type: '@edtr-io/document'
  plugin: string
  state: PluginState
}
