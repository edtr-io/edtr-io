import * as InternalPlugin from '@edtr-io/internal__plugin'

import { StateType } from './internal-plugin-state'

/** @public */
export type EditorPlugin<
  S extends StateType = StateType,
  Config extends {} = {}
> = InternalPlugin.EditorPlugin<S, Config>
/** @public */
export type EditorPluginProps<
  S extends StateType = StateType,
  Config extends {} = {}
> = InternalPlugin.EditorPluginProps<S, Config>
