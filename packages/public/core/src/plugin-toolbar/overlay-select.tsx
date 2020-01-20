import { OverlaySelectProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar.OverlaySelect}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlaySelectProps}
 * @public
 */
export function OverlaySelect(props: OverlaySelectProps) {
  const { OverlaySelect } = React.useContext(PluginToolbarContext)
  return <OverlaySelect {...props} />
}
