import {
  child,
  object,
  string,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { SpoilerEditor } from './editor'

/** @public */
export const spoilerState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})
/** @public */
export type SpoilerState = typeof spoilerState
/** @public */
export interface SpoilerConfig {
  theme: {
    color: string
  }
}
/** @public */
export type SpoilerProps = EditorPluginProps<SpoilerState, SpoilerConfig>

/** @public */
export function createSpoilerPlugin({
  theme = {}
}: {
  theme?: Partial<SpoilerConfig['theme']>
} = {}): EditorPlugin<SpoilerState, SpoilerConfig> {
  return {
    Component: SpoilerEditor,
    config: () => {
      return {
        theme: {
          color: '#f5f5f5',
          ...theme
        }
      }
    },
    state: spoilerState
  }
}
