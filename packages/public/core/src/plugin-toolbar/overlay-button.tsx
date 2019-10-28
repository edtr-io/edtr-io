import { OverlayButtonProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export function OverlayButton(props: OverlayButtonProps) {
  const { OverlayButton } = React.useContext(PluginToolbarContext)
  return <OverlayButton {...props} />
}
