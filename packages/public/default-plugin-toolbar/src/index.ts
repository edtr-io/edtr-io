import { PluginToolbar } from '@edtr-io/plugin-toolbar/beta'

import { DefaultPluginToolbarConfig } from './config'
import { createOverlayButton } from './overlay-button'
import { createOverlayCheckbox } from './overlay-checkbox'
import { createOverlayInput } from './overlay-input'
import { createOverlaySelect } from './overlay-select'
import { createOverlayTextarea } from './overlay-textarea'
import { createPluginToolbarButton } from './plugin-toolbar-button'
import { createPluginToolbarOverlayButton } from './plugin-toolbar-overlay-button'

/**
 * Creates the default {@link @edtr-io/plugin-toolbar#PluginToolbar | plugin toolbar}
 *
 * @param config - Optional configuration
 * @returns The default {@link @edtr-io/plugin-toolbar#PluginToolbar | plugin toolbar}
 * @beta
 */
export function createDefaultPluginToolbar(
  config: DefaultPluginToolbarConfig = { primaryColor: 'rgb(70, 155, 255)' }
): PluginToolbar {
  return {
    OverlayButton: createOverlayButton(config),
    OverlayCheckbox: createOverlayCheckbox(config),
    OverlayInput: createOverlayInput(config),
    OverlaySelect: createOverlaySelect(config),
    OverlayTextarea: createOverlayTextarea(config),
    PluginToolbarButton: createPluginToolbarButton(config),
    PluginToolbarOverlayButton: createPluginToolbarOverlayButton(config)
  }
}

export { DefaultPluginToolbarConfig }
