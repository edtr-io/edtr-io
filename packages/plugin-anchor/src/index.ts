import { faAnchor, createIcon } from '@edtr-io/editor-ui'
import { string, StatefulPlugin } from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

export const anchorState = string()

export const anchorPlugin: StatefulPlugin<typeof anchorState> = {
  Component: AnchorEditor,
  state: anchorState,
  title: 'Anker',
  description: 'Füge eine Sprungmarke innerhalb deines Inhalts hinzu.',
  icon: createIcon(faAnchor)
}
