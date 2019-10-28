/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { isStatefulPlugin } from '@edtr-io/internal__plugin'
import { getDocument, getPlugin } from '@edtr-io/store'
import { useTheme } from '@edtr-io/ui'
import * as React from 'react'

import { DocumentProps } from '.'
import { useScopedSelector } from '../store'

export function DocumentRenderer({ id, pluginProps }: DocumentProps) {
  const document = useScopedSelector(getDocument(id))
  const defaultFocusRef = React.useRef(null)
  const plugin = useScopedSelector(
    state => document && getPlugin(document.plugin)(state)
  )
  const theme = useTheme()
  if (!document) return null
  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  const config =
    typeof plugin.config === 'function' ? plugin.config(theme) : plugin.config

  let pluginState: unknown
  if (isStatefulPlugin(plugin)) {
    pluginState = plugin.state.init(document.state, () => {})
  }

  return (
    <plugin.Component
      name={document.plugin}
      id={id}
      editable={false}
      focused={false}
      defaultFocusRef={defaultFocusRef}
      renderIntoSettings={() => {
        return null
      }}
      {...pluginProps}
      state={pluginState}
      config={config}
    />
  )
}
