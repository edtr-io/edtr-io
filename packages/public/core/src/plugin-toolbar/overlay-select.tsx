import { OverlaySelectProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export function OverlaySelect(props: OverlaySelectProps) {
  const { OverlaySelect } = React.useContext(PluginToolbarContext)
  return <OverlaySelect {...props} />
}
