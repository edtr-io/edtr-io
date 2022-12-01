import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar,
  SerializedScalarStateType,
  StateTypeValueType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import {
  ListsEditor,
  ListType,
  withLists,
  withListsReact,
} from '@prezly/slate-lists'
import isHotkey from 'is-hotkey'
import * as R from 'ramda'
import * as React from 'react'
import {
  BaseEditor,
  createEditor,
  Descendant,
  Element,
  Node,
  Range,
  CustomTypes,
  Editor as SlateEditor,
  Transforms,
} from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

import { HoveringToolbar } from './components/hovering-toolbar'
// TODO: rename link-element file to link-controls
import { LinkControls } from './components/link-element'
import { MathElement } from './math'

// TODO: Move to a better place
const emptyDocument: StateTypeValueType<TextPluginState> = {
  value: [{ type: 'p', children: [{ text: '' }] }],
  selection: null,
}

// TODO: config of colours
const blue = '#1794c1',
  green = '#469a40',
  orange = '#ff6703'

export const config = {
  colors: [blue, green, orange],
}

// TODO: Find a better place
// TODO: Use enum for types here as in https://www.npmjs.com/package/@prezly/slate-lists
// TODO: Fix "as ..." parts in the functions
const withListsPlugin = withLists({
  isConvertibleToListTextNode(node: Node) {
    return Element.isElementType(node, 'p')
  },
  isDefaultTextNode(node: Node) {
    return Element.isElementType(node, 'p')
  },
  isListNode(node: Node, type?: ListType) {
    if (type) {
      return Element.isElementType(node, type)
    }
    return (
      Element.isElementType(node, 'ordered-list') ||
      Element.isElementType(node, 'unordered-list')
    )
  },
  isListItemNode(node: Node) {
    return Element.isElementType(node, 'list-item')
  },
  isListItemTextNode(node: Node) {
    return Element.isElementType(node, 'list-item-text')
  },
  createDefaultTextNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: 'p' } as Paragraph
  },
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    const nodeType =
      type === ListType.ORDERED ? 'ordered-list' : 'unordered-list'
    return { children: [{ text: '' }], ...props, type: nodeType } as
      | OrderedList
      | UnorderedList
  },
  createListItemNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: 'list-item' } as ListItem
  },
  createListItemTextNode(props = {}) {
    return {
      children: [{ text: '' }],
      ...props,
      type: 'list-item-child',
    } as ListItemText
  },
})

function TextEditor(props: TextProps) {
  const editor = React.useMemo(
    () =>
      withListsReact(withListsPlugin(withReact(createEditor() as ReactEditor))),
    []
  )

  // TODO: Delete after we change the edtr-io state of the text plugin
  const [, setSelection] = React.useState(editor.selection)

  editor.isInline = (element) => {
    return element.type === 'a' || element.type === 'math'
  }

  editor.isVoid = (element) => {
    return element.type == 'math'
  }

  // TODO: Change state + selection
  return (
    <Slate
      editor={editor}
      value={props.state.value.value}
      onChange={() => {
        console.log(editor.children)
        setSelection(editor.selection)
      }}
    >
      <HoveringToolbar
        closeSubMenuIcon={null}
        closeSubMenuTitle="Close"
        config={props.config}
      />
      {props.editable ? <LinkControls editor={editor} /> : null}
      <Editable
        onKeyDown={(event) => {
          if (isHotkey('mod+b')(event)) {
            event.preventDefault()
            return toggleBoldMark(editor)
          } else if (isHotkey('mod+i')(event)) {
            event.preventDefault()
            return toggleItalicMark(editor)
          } else if (isHotkey('mod+k', event)) {
            event.preventDefault()
            return toggleLink(editor)
          }
        }}
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
            return (
              <MathElement
                element={props.element}
                attributes={props.attributes}
              >
                {props.children}
              </MathElement>
            )
          }

          if (props.element.type != 'p') {
            console.log(props.element)
          }
          return <p {...props.attributes}>{props.children}</p>
        }}
        renderLeaf={({ attributes, leaf, children }) => {
          if (leaf.strong) {
            children = <strong>{children}</strong>
          }
          if (typeof leaf.color === 'number') {
            children = (
              <span
                style={{
                  color: config.colors[leaf.color % config.colors.length],
                }}
              >
                {children}
              </span>
            )
          }
          if (leaf.code) {
            children = <code>{children}</code>
          }
          if (leaf.em) {
            children = <em>{children}</em>
          }
          return <span {...attributes}>{children}</span>
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
): EditorPlugin<TextPluginState, TextPluginConfig> {
  return {
    Component: TextEditor,
    // @ts-expect-error TODO:
    config: ({ editor }) => {
      return {
        ...config,
        theme: R.mergeDeepRight(
          {
            backgroundColor: 'transparent',
            color: editor.color,
            hoverColor: editor.primary.background,
            active: {
              backgroundColor: '#b6b6b6',
              color: editor.backgroundColor,
            },
          },
          config.theme || {}
        ),
      }
    },
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

// TODO: Duplicates of hovering-toolbar => Refactor
function isBoldActive(editor: CustomTypes['Editor']) {
  return SlateEditor.marks(editor)?.strong === true
}

function toggleBoldMark(editor: CustomTypes['Editor']) {
  if (isBoldActive(editor)) {
    SlateEditor.removeMark(editor, 'strong')
  } else {
    SlateEditor.addMark(editor, 'strong', true)
  }
}

function isItalicActive(editor: CustomTypes['Editor']) {
  return SlateEditor.marks(editor)?.em === true
}

function toggleItalicMark(editor: CustomTypes['Editor']) {
  if (isItalicActive(editor)) {
    SlateEditor.removeMark(editor, 'em')
  } else {
    SlateEditor.addMark(editor, 'em', true)
  }
}

function isLinkActive(editor: CustomTypes['Editor']) {
  return selectionHasElement((e) => e.type === 'a', editor)
}

function selectionHasElement(
  predicate: (element: Element) => boolean,
  editor: CustomTypes['Editor']
) {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n) =>
        !SlateEditor.isEditor(n) && Element.isElement(n) && predicate(n),
    })
  )

  return !!match
}
function toggleLink(editor: CustomTypes['Editor']) {
  if (isLinkActive(editor)) {
    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && n.type === 'a',
    })
  } else {
    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)

    if (isCollapsed) {
      // TODO: how set focus to input field, when it is newly created?
      Transforms.insertNodes(editor, {
        type: 'a',
        href: '',
        children: [{ text: 'link' }],
      })
    } else {
      Transforms.wrapNodes(
        editor,
        {
          type: 'a',
          href: '',
          children: [],
        },
        { split: true }
      )
      Transforms.collapse(editor, { edge: 'end' })
    }
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
export type TextProps = EditorPluginProps<TextPluginState, TextPluginConfig>

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

export interface Link {
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

interface CustomText {
  text: string
  strong?: true
  em?: true
  code?: true
  color?: number
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & ListsEditor
    Element: CustomElement
    Text: CustomText
  }
}
