import * as InternalPluginToolbar from '@edtr-io/internal__plugin-toolbar/beta'
import * as React from 'react'

import { PluginToolbarContext } from '../contexts'

// eslint-disable-next-line jsdoc/require-returns
/**
 * Renders the {@link @edtr-io/plugin-toolbar#PluginToolbar | OverlayInput}
 *
 * @param props - {@link @edtr-io/plugin-toolbar#OverlayInputProps}
 * @public
 */
export function OverlayInput(props: OverlayInputProps) {
  const { OverlayInput } = React.useContext(PluginToolbarContext)
  return <OverlayInput {...props} ref={undefined} />
}
/** @public */
export type OverlayInputProps = InternalPluginToolbar.OverlayInputProps
