import { StatefulPlugin, StateType } from '@edtr-io/core'

import { AnchorEditor } from './editor'

export const anchorState = StateType.string()

export const anchorPlugin: StatefulPlugin<typeof anchorState> = {
  Component: AnchorEditor,
  state: anchorState
}
