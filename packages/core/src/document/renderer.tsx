import { isStatefulPlugin } from '@edtr-io/abstract-plugin'
import { getDocument, getPlugin } from '@edtr-io/store'
import * as React from 'react'

import { DocumentProps } from '.'
import { useScopedSelector } from '../store'

export function DocumentRenderer({ id, pluginProps }: DocumentProps) {
  const document = useScopedSelector(getDocument(id))
  const plugin = useScopedSelector(
    state => document && getPlugin(document.plugin)(state)
  )
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
}
