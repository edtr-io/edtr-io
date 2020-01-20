import { OverlayButtonProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar.OverlayButton}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayButtonProps}
 * @public
 */
export function OverlayButton(props: OverlayButtonProps) {
  const { OverlayButton } = React.useContext(PluginToolbarContext)
  return <OverlayButton {...props} />
}
