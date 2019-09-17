import { OverlayTextareaProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export function OverlayTextarea(props: OverlayTextareaProps) {
  const { OverlayTextarea } = React.useContext(PluginToolbarContext)
  return <OverlayTextarea {...props} />
}
