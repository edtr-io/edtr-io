import { PluginToolbarOverlayButtonProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export function PluginToolbarOverlayButton(
  props: PluginToolbarOverlayButtonProps
) {
  const { PluginToolbarOverlayButton } = React.useContext(PluginToolbarContext)
  return <PluginToolbarOverlayButton {...props} />
}
