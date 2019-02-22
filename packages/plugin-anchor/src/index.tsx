import { AnchorEditor } from './editor'
import { StatefulPlugin, StateType } from '@edtr-io/core'

export const anchorState = StateType.string()

export const anchorPlugin: StatefulPlugin<typeof anchorState> = {
  Component: AnchorEditor,
  state: anchorState
}
