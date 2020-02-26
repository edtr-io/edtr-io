import * as InternalPluginToolbar from '@edtr-io/internal__plugin-toolbar/beta'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlayTextarea}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayTextareaProps}
 * @public
 */
export function OverlayTextarea(props: OverlayTextareaProps) {
  const { OverlayTextarea } = React.useContext(PluginToolbarContext)
  return <OverlayTextarea {...props} />
}
/** @public */
export type OverlayTextareaProps = InternalPluginToolbar.OverlayTextareaProps
