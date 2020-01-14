import { EditorPlugin, EditorPluginProps, string } from '@edtr-io/plugin'

import { SerloInjectionEditor } from './editor'

/** @public */
export const serloInjectionState = string()
/** @public */
export type SerloInjectionState = typeof serloInjectionState
/** @public */
export type SerloInjectionProps = EditorPluginProps<SerloInjectionState>

/** @public */
export function createSerloInjectionPlugin(): EditorPlugin<
  SerloInjectionState
> {
  return {
    Component: SerloInjectionEditor,
    config: {},
    state: serloInjectionState
  }
}
