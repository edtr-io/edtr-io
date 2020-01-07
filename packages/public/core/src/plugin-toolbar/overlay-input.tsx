import { OverlayInputProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

export function OverlayInput(props: OverlayInputProps) {
  const { OverlayInput } = React.useContext(PluginToolbarContext)
  return <OverlayInput {...props} ref={undefined} />
}
