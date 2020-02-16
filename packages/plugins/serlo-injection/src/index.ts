import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType
} from '@edtr-io/plugin'

import { SerloInjectionEditor } from './editor'

/** @public */
export type SerloInjectionState = StringStateType
/** @public */
export type SerloInjectionProps = EditorPluginProps<SerloInjectionState>

const serloInjectionState: SerloInjectionState = string()

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
