import { Plugin, string } from '@edtr-io/plugin'
import { createIcon, faAnchor } from '@edtr-io/ui'

import { AnchorEditor } from './editor'

export const anchorState = string()

export const anchorPlugin: Plugin<typeof anchorState> = {
  Component: AnchorEditor,
  state: anchorState,
  title: 'Anker',
  description: 'Füge eine Sprungmarke innerhalb deines Inhalts hinzu.',
  icon: createIcon(faAnchor)
}
