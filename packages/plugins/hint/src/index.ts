import {
  child,
  object,
  string,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'

import { HintEditor } from './editor'

/** @public */
export const hintState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})
/** @public */
export type HintState = typeof hintState
/** @public */
export type HintProps = EditorPluginProps<HintState>

/** @public */
export function createHintPlugin(): EditorPlugin<HintState> {
  return {
    Component: HintEditor,
    config: {},
    state: hintState
  }
}
