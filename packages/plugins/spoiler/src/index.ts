import {
  child,
  object,
  string,
  EditorPluginProps,
  EditorPlugin,
  ObjectStateType,
  StringStateType,
  ChildStateType
} from '@edtr-io/plugin'

import { SpoilerEditor } from './editor'

/** @public */
export type SpoilerState = ObjectStateType<{
  title: StringStateType
  content: ChildStateType
}>
/** @public */
export interface SpoilerStaticConfig {
  content?: Parameters<typeof child>[0]
}
/** @public */
export interface SpoilerConfig {
  theme: {
    color: string
  }
}
/** @public */
export type SpoilerProps = EditorPluginProps<SpoilerState, SpoilerConfig>

function createSpoilerState({ content }: SpoilerStaticConfig): SpoilerState {
  return object({
    title: string(''),
    content: child(content)
  })
}

/** @public */
export function createSpoilerPlugin({
  content = {},
  theme = {}
}: SpoilerStaticConfig & {
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
    state: createSpoilerState({ content })
  }
}
