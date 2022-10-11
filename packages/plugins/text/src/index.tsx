import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar,
  SerializedScalarStateType,
  StateTypeValueType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as React from 'react'
import { Descendant, Range, BaseEditor, createEditor } from 'slate'
import { ReactEditor, Editable, withReact, Slate } from 'slate-react'

// TODO: Move to a better place
const emptyDocument: StateTypeValueType<TextPluginState> = {
  value: [{ type: 'paragraph', children: [{ text: '' }] }],
  selection: null,
}

// TODO: config of colours
const blue = '#1794c1',
    green = '#469a40',
    orange = '#ff6703'

const config = {
  colors: [blue, green, orange]
}

function TextEditor(props: TextProps) {
  const [editor] = React.useState(() => withReact(createEditor()))

  // TODO: Change state + selection
  return (
    <Slate editor={editor} value={props.state.value.value}>
      <Editable
        renderElement={(props) => {
          return <p {...props.attributes}>{props.children}</p>
        }}
        renderLeaf={(props) => {
          if (props.text.strong) {
            return <strong {...props.attributes}>{props.text.text}</strong>
          }
          if (typeof props.text.color === "number") {
            return <span style={{color: config.colors[props.text.color % config.colors.length]}} {...props.attributes}>{props.text.text}</span>
          }
          if (props.text.code) {
            return <code {...props.attributes}>{props.text.text}</code>
          }
          if (props.text.em) {
            return <em {...props.attributes}>{props.text.text}</em>
          }
          return <span {...props.attributes}>{props.text.text}</span>
        }}
      />
    </Slate>
  )
}

/**
 * @param config - {@link TextConfig | Plugin configuration}
 * @returns The text plugin
 * @public
 */
export function createTextPlugin(
  config: TextConfig
): EditorPlugin<TextPluginState, TextConfig> {
  return {
    Component: TextEditor,
    config,
    state: serializedScalar(emptyDocument, {
      serialize({ value }) {
        return value
      },
      deserialize(value) {
        return { value, selection: null }
      },
    }),
    onKeyDown() {
      return false
    },
    /* TODO
    isEmpty: (state) => {
      return isValueEmpty(Value.fromJSON(state.value))
    },
     */
  }
}

/** @public */
export interface TextConfig {
  placeholder?: TextPluginConfig['placeholder']
  plugins?: TextConfigPlugins
  /** @deprecated */
  registry: TextPluginConfig['registry']
  i18n?: DeepPartial<TextPluginConfig['i18n']>
  theme?: DeepPartial<TextPluginConfig['theme']>
  blockquote?: string
  noLinebreaks?: boolean
}

/** @public */
export interface TextConfigPlugins {
  code?: boolean
  colors?: boolean
  headings?: boolean
  katex?: boolean
  links?: boolean
  lists?: boolean
  math?: boolean
  paragraphs?: boolean
  richText?: boolean
  suggestions?: boolean
}

/** @public */
export type TextPluginState = SerializedScalarStateType<
  Descendant[],
  { value: Descendant[]; selection: Range | null }
>

/** @public */
export interface TextPluginConfig {
  placeholder: string
  enabledPlugins: TextConfigPlugins
  // TODO
  //plugins: ((pluginClosure: SlatePluginClosure) => TextPlugin)[]
  registry: {
    name: string
    title?: string
    description?: string
  }[]
  i18n: {
    blockquote: {
      toggleTitle: string
    }
    code: {
      toggleTitle: string
    }
    colors: {
      setColorTitle: string
      resetColorTitle: string
      openMenuTitle: string
      closeMenuTitle: string
    }
    headings: {
      setHeadingTitle(level: number): string
      openMenuTitle: string
      closeMenuTitle: string
    }
    link: {
      toggleTitle: string
      placeholder: string
      openInNewTabTitle: string
    }
    list: {
      toggleOrderedList: string
      toggleUnorderedList: string
      openMenuTitle: string
      closeMenuTitle: string
    }
    math: {
      toggleTitle: string
      displayBlockLabel: string
      placeholder: string
      editors: {
        visual: string
        latex: string
        noVisualEditorAvailableMessage: string
      }
      helpText(
        KeySpan: React.ComponentType<{ children: React.ReactNode }>
      ): React.ReactNode
    }
    richText: {
      toggleStrongTitle: string
      toggleEmphasizeTitle: string
    }
    suggestions: {
      noResultsMessage: string
    }
  }
  theme: {
    backgroundColor: string
    color: string
    hoverColor: string
    active: {
      backgroundColor: string
      color: string
    }
    dropDown: {
      backgroundColor: string
    }
    suggestions: {
      background: {
        default: string
        highlight: string
      }
      text: {
        default: string
        highlight: string
      }
    }
    plugins: {
      colors: {
        colors: string[]
        defaultColor: string
      }
    }
  }
  blockquote?: string
  noLinebreaks?: boolean
}

/** @public */
export type TextProps = EditorPluginProps<TextPluginState, TextConfig>

// TODO: We need to configure this!
interface CustomElement {
  type: 'paragraph'
  children: CustomText[]
}
interface CustomText {
  text: string
  strong?: true
  em?: true
  code?: true
  color?: number
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
