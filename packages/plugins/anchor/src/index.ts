import { EditorPlugin, string } from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

export const anchorState = string()

export function createAnchorPlugin(): EditorPlugin<typeof anchorState> {
  return {
    Component: AnchorEditor,
    config: {},
    state: anchorState
  }
}
