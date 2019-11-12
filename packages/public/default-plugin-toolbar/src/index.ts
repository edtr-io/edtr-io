import { PluginToolbar } from '@edtr-io/plugin-toolbar'

import { DefaultPluginToolbarConfig } from './config'
import { createOverlayButton } from './overlay-button'
import { createOverlayCheckbox } from './overlay-checkbox'
import { createOverlayInput } from './overlay-input'
import { createOverlaySelect } from './overlay-select'
import { createOverlayTextarea } from './overlay-textarea'
import { createPluginToolbarButton } from './plugin-toolbar-button'
import { createPluginToolbarOverlayButton } from './plugin-toolbar-overlay-button'

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
