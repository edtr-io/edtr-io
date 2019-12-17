import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

const anchorState = string()
export type AnchorState = typeof anchorState
export type AnchorProps = EditorPluginProps<AnchorState>

export function createAnchorPlugin(): EditorPlugin<AnchorState> {
  return {
    Component: AnchorEditor,
    config: {},
    state: anchorState
  }
}
