import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar,
  SerializedScalarStateType,
  StateTypeValueType,
} from '@edtr-io/plugin'
import { DeepPartial, styled } from '@edtr-io/ui'
import KaTeX from 'katex'
import * as React from 'react'
import { Descendant, Range, BaseEditor, createEditor } from 'slate'
import { ReactEditor, Editable, withReact, Slate } from 'slate-react'

// TODO: Move to a better place
const emptyDocument: StateTypeValueType<TextPluginState> = {
  value: [{ type: 'p', children: [{ text: '' }] }],
  selection: null,
}

// TODO: config of colours
const blue = '#1794c1',
  green = '#469a40',
  orange = '#ff6703'

const config = {
  colors: [blue, green, orange],
}

const KaTeXSpan = styled.span<{ element: MathElement }>(({ element }) => {
  if (!element.inline) {
    return {
      display: 'block',
      margin: '1em 0',
      textAlign: 'center',
    }
  }
})

function TextEditor(props: TextProps) {
  const [editor] = React.useState(() => withReact(createEditor()))

  // TODO: Change state + selection
  return (
    <Slate editor={editor} value={props.state.value.value}>
      <Editable
        renderElement={(props) => {
          if (props.element.type === 'h') {
            const level = props.element.level
            const headingLevel = level <= 6 && level >= 1 ? level : 6
            return React.createElement(
              `h${headingLevel}`,
              props.attributes,
              <>{props.children}</>
            )
          }
          if (props.element.type === 'a') {
            return (
              <a
                href={props.element.href}
                style={{ cursor: 'pointer' }}
                {...props.attributes}
              >
                {props.children}
              </a>
            )
          }

          if (props.element.type === 'unordered-list') {
            return <ul {...props.attributes}>{props.children}</ul>
          }
          if (props.element.type === 'ordered-list') {
            return <ol {...props.attributes}>{props.children}</ol>
          }
          if (props.element.type === 'list-item') {
            return <li {...props.attributes}>{props.children}</li>
          }
          if (props.element.type === 'list-item-child') {
            return <div {...props.attributes}>{props.children}</div>
          }

          if (props.element.type === 'math') {
            const { inline, src } = props.element
            const html = KaTeX.renderToString(
              `${inline ? '' : '\\displaystyle '}${src}`,
              {
                displayMode: false,
                throwOnError: false,
              }
            )

            return (
              <KaTeXSpan
                dangerouslySetInnerHTML={{ __html: html }}
                element={props.element}
              />
            )
          }

          if (props.element.type != 'p') {
            console.log(props.element)
          }
          return <p {...props.attributes}>{props.children}</p>
        }}
        renderLeaf={(props) => {
          if (props.text.strong) {
            return <strong {...props.attributes}>{props.text.text}</strong>
          }
          if (typeof props.text.color === 'number') {
            return (
              <span
                style={{
                  color: config.colors[props.text.color % config.colors.length],
                }}
                {...props.attributes}
              >
                {props.text.text}
              </span>
            )
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
type CustomElement =
  | Paragraph
  | OrderedList
  | UnorderedList
  | ListItem
  | ListItemText
  | Heading
  | Link
  | MathElement

interface Heading {
  type: 'h'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: CustomText[]
}

interface Paragraph {
  type: 'p'
  children: CustomText[]
}

interface Link {
  type: 'a'
  href: string
  children: CustomText[]
}

interface UnorderedList {
  type: 'unordered-list'
  children: ListItem[]
}

interface OrderedList {
  type: 'ordered-list'
  children: ListItem[]
}

interface ListItem {
  type: 'list-item'
  children: ListItemText[]
}

interface ListItemText {
  type: 'list-item-child'
  children: CustomText[]
}

interface MathElement {
  type: 'math'
  src: string
  inline: boolean
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
