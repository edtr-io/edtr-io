import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType
} from '@edtr-io/plugin'

import { AnchorEditor } from './editor'

/** @public */
export type AnchorState = StringStateType
/** @public */
export type AnchorProps = EditorPluginProps<AnchorState>

const anchorState: AnchorState = string()

/** @public */
export function createAnchorPlugin(): EditorPlugin<AnchorState> {
  return {
    Component: AnchorEditor,
    config: {},
    state: anchorState
  }
}
