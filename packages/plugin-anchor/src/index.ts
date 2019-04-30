import { StatefulPlugin, StateType } from '@edtr-io/core'

import { AnchorEditor } from './editor'
import { faAnchor, createIcon } from '@edtr-io/editor-ui'

export const anchorState = StateType.string()

export const anchorPlugin: StatefulPlugin<typeof anchorState> = {
  Component: AnchorEditor,
  state: anchorState,
  title: 'Anker',
  description: 'Füge eine Sprungmarke innerhalb deines Inhalts hinzu.',
  icon: createIcon(faAnchor)
}
