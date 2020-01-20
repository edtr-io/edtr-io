import { PluginToolbarOverlayButtonProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar.PluginToolbarOverlayButton}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#PluginToolbarOverlayButtonProps}
 * @public
 */
export function PluginToolbarOverlayButton(
  props: PluginToolbarOverlayButtonProps
) {
  const { PluginToolbarOverlayButton } = React.useContext(PluginToolbarContext)
  return <PluginToolbarOverlayButton {...props} />
}
