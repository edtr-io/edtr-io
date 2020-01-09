import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar
} from '@edtr-io/plugin'
import * as R from 'ramda'
import { Node, Range } from 'slate'

import { TextEditor } from './editor'
import { defaultPlugins } from './plugins'
import { TextConfig } from './types'

const textState = serializedScalar<
  Node[],
  { value: Node[]; selection: Range | null }
>(
  {
    value: [
      {
        type: 'paragraph',
        children: [{ text: '' }]
      }
    ],
    selection: null
  },
  {
    deserialize(value) {
      return {
        value,
        selection: null
      }
    },
    serialize({ value }) {
      return value
    }
  }
)
export type TextState = typeof textState
export { TextConfig }
export type TextProps = EditorPluginProps<TextState, TextConfig>

export function createTextPlugin({
  placeholder = 'Schreibe etwas oder füge mit \u2295 Elemente hinzu.',
  plugins = defaultPlugins,
  theme = {}
}: {
  placeholder?: TextConfig['placeholder']
  plugins?: TextConfig['plugins']
  theme?: DeepPartial<TextConfig['theme']>
}): EditorPlugin<TextState, TextConfig> {
  return {
    Component: TextEditor,
    config: ({ editor }) => {
      return {
        placeholder,
        plugins,
        theme: R.mergeDeepRight(
          {
            backgroundColor: 'transparent',
            color: editor.color,
            hoverColor: editor.primary.background,
            active: {
              backgroundColor: '#b6b6b6',
              color: editor.backgroundColor
            }
          },
          theme
        )
      }
    },
    state: textState
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>
}
