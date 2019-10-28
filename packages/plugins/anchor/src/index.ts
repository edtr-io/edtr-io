import { StatefulPlugin, string } from '@edtr-io/plugin'
import { createIcon, faAnchor } from '@edtr-io/ui'

import { AnchorEditor } from './editor'

export const anchorState = string()

export function createAnchorPlugin(): StatefulPlugin<typeof anchorState> {
  return {
    Component: AnchorEditor,
    config: {},
    state: anchorState,
    title: 'Anker',
    description: 'Füge eine Sprungmarke innerhalb deines Inhalts hinzu.',
    icon: createIcon(faAnchor)
  }
}
