import * as React from 'react'

import { EditorContext } from '../editor-context'
import { getDocument, getPlugin } from '../store'

import { DocumentProps } from '.'
import { isStatefulPlugin } from '../plugin'

export const DocumentRenderer: React.FunctionComponent<DocumentProps> = ({
  id,
  pluginProps
}) => {
  const store = React.useContext(EditorContext)

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

  let pluginState: unknown
  if (isStatefulPlugin(plugin)) {
    pluginState = plugin.state(document.state, () => {})
  }
  return <plugin.Component {...pluginProps} state={pluginState} />
}
