import * as React from 'react'

import { connectStateOnly } from '../editor-context'
import { isStatefulPlugin } from '../plugin'
import { getDocument } from '../store/documents'
import { DocumentProps } from '.'
import { getPlugin } from '../store/plugins'

export const DocumentRenderer = connectStateOnly<
  DocumentRendererStateProps,
  DocumentProps
>((state, { id }) => {
  const document = getDocument(state, id)
  return {
    document: getDocument(state, id),
    plugin: document && getPlugin(state, document.plugin)
  }
})(function({
  pluginProps,
  document,
  plugin
}: DocumentProps & DocumentRendererStateProps) {
  if (!document) return null
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
})

export interface DocumentRendererStateProps {
  document: ReturnType<typeof getDocument>
  plugin: ReturnType<typeof getPlugin>
}
