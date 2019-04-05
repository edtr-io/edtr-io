import * as React from 'react'

import { DocumentProps, DocumentStateProps } from '.'
import { isStatefulPlugin } from '../plugin'

export const DocumentRenderer: React.FunctionComponent<
  DocumentProps & DocumentStateProps
> = ({ id, pluginProps, ...props }) => {
  const document = props.getDocument(id)
  if (!document) {
    return null
  }

  const plugin = props.getPlugin(document.plugin)

  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  let pluginState: unknown
  if (isStatefulPlugin(plugin)) {
    pluginState = plugin.state(document.state, () => {})
  }
  return <plugin.Component {...pluginProps} state={pluginState} />
}
