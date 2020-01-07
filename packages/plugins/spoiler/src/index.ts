import {
  child,
  object,
  string,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { SpoilerEditor } from './editor'

const spoilerState = object({
  title: string(''),
  content: child({ plugin: 'rows' })
})
export type SpoilerState = typeof spoilerState
export interface SpoilerConfig {
  theme: {
    color: string
  }
}
export type SpoilerProps = EditorPluginProps<SpoilerState, SpoilerConfig>

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
