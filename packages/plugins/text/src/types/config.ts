import { SerializedScalarStateType } from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import { Descendant, Range } from 'slate'

import { Heading } from '.'

/** @public */
export type TextEditorState = SerializedScalarStateType<
  Descendant[],
  { value: Descendant[]; selection: Range | null }
>

/** @public */
export interface TextEditorConfig {
  placeholder?: TextEditorPluginConfig['placeholder']
  plugins?: TextEditorPlugin[]
  /** @deprecated */
  registry: TextEditorPluginConfig['registry']
  i18n?: DeepPartial<TextEditorPluginConfig['i18n']>
  theme?: DeepPartial<TextEditorPluginConfig['theme']>
  blockquote?: string
  noLinebreaks?: boolean
}

/** @public */
export enum TextEditorPlugin {
  code = 'code',
  colors = 'colors',
  headings = 'headings',
  katex = 'katex',
  links = 'links',
  lists = 'lists',
  math = 'math',
  paragraphs = 'paragraphs',
  richText = 'richText',
}

/** @public */
export interface TextEditorPluginConfig {
  placeholder: string
  enabledPlugins: TextEditorPlugin[]
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
      colorNames: string[]
    }
    headings: {
      setHeadingTitle(level: Heading['level']): string
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
    borderColor: string
    borderRadius: string
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
    overlay: {
      backgroundColor: string
      boxShadow: string
      color: string
    }
    plugins: {
      colors: {
        colors: string[]
        defaultColor: string
      }
      headings: Heading['level'][]
    }
  }
  blockquote?: string
  noLinebreaks?: boolean
}
