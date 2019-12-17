import {
  child,
  object,
  string,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'

import { HintEditor } from './editor'

const hintState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})
export type HintState = typeof hintState
export type HintProps = EditorPluginProps<HintState>

export function createHintPlugin(): EditorPlugin<HintState> {
  return {
    Component: HintEditor,
    config: {},
    state: hintState
  }
}
