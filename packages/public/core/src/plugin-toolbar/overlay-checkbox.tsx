import { OverlayCheckboxProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export function OverlayCheckbox(props: OverlayCheckboxProps) {
  const { OverlayCheckbox } = React.useContext(PluginToolbarContext)
  return <OverlayCheckbox {...props} />
}
