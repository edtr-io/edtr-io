import { PluginToolbarButtonProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export const PluginToolbarButton = React.forwardRef<
  HTMLButtonElement,
  PluginToolbarButtonProps
>(function PluginToolbarButton(props, ref) {
  const { PluginToolbarButton } = React.useContext(PluginToolbarContext)
  return <PluginToolbarButton {...props} ref={ref} />
})
