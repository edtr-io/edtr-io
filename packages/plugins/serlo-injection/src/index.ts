import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'

import { SerloInjectionEditor } from './editor'

const serloInjectionState = string()
export type SerloInjectionState = typeof serloInjectionState
export type SerloInjectionProps = EditorPluginProps<SerloInjectionState>

export function createSerloInjectionPlugin(): EditorPlugin<
  SerloInjectionState
> {
  return {
    Component: SerloInjectionEditor,
    config: {},
    state: serloInjectionState
  }
}
