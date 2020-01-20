import { OverlayCheckboxProps } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar.OverlayCheckbox}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayCheckboxProps}
 * @public
 */
export function OverlayCheckbox(props: OverlayCheckboxProps) {
  const { OverlayCheckbox } = React.useContext(PluginToolbarContext)
  return <OverlayCheckbox {...props} />
}
