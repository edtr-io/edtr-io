import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

/** @public */
export const anchorState = string()
/** @public */
export type AnchorState = typeof anchorState
/** @public */
export type AnchorProps = EditorPluginProps<AnchorState>

/** @public */
export function createAnchorPlugin(): EditorPlugin<AnchorState> {
  return {
    Component: AnchorEditor,
    config: {},
    state: anchorState
  }
}
