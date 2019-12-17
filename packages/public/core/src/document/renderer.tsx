/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { EditorPlugin } from '@edtr-io/internal__plugin'
import { getDocument, getPlugin } from '@edtr-io/store'
import { useTheme } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'

import { DocumentProps } from '.'
import { useScopedSelector } from '../store'

export function DocumentRenderer({ id, pluginProps }: DocumentProps) {
  const document = useScopedSelector(getDocument(id))
  const plugin = useScopedSelector(
    state => document && getPlugin(document.plugin)(state)
  )
  const focusRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const theme = useTheme()
  if (!document) return null
  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  const pluginWithConfig = plugin as EditorPlugin
  const defaultConfig =
    typeof pluginWithConfig.config === 'function'
      ? pluginWithConfig.config(theme)
      : pluginWithConfig.config
  const overrideConfig = (pluginProps && pluginProps.config) || {}
  const config = R.mergeDeepRight(defaultConfig, overrideConfig)

  const pluginState = plugin.state.init(document.state, () => {})

  // This should be fine as soon as we remove DeprecatedPlugin
  return (
    <plugin.Component
      {...pluginProps}
      config={config}
      state={pluginState}
      id={id}
      name={document.plugin}
      editable={false}
      focused={false}
      defaultFocusRef={focusRef}
      renderIntoSettings={() => null}
    />
  )
}
