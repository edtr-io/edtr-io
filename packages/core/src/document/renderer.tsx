import * as React from 'react'

import { connectStateOnly } from '../editor-context'
import { isStatefulPlugin } from '../plugin'
import { selectors } from '../store'
import { DocumentProps } from '.'

export const DocumentRenderer = connectStateOnly<
  DocumentRendererStateProps,
  DocumentProps & { scope: string }
>((state, { id }) => {
  const document = selectors.getDocument(state, id)
  return {
    document: selectors.getDocument(state, id),
    plugin: document && selectors.getPlugin(state, document.plugin)
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
  document: ReturnType<typeof selectors['getDocument']>
  plugin: ReturnType<typeof selectors['getPlugin']>
}
