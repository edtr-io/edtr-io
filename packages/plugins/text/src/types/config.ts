import { SerializedScalarStateType } from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import { Descendant, Range } from 'slate'

import { Heading } from './text-editor'

/** @public */
export type TextEditorState = SerializedScalarStateType<
  Descendant[],
  { value: Descendant[]; selection: Range | null }
>

/** @public */
export interface TextEditorConfig {
  placeholder?: TextEditorPluginConfig['placeholder']
  controls?: TextEditorControl[]
  i18n?: DeepPartial<TextEditorPluginConfig['i18n']>
  theme?: DeepPartial<TextEditorPluginConfig['theme']>
  blockquote?: string
  noLinebreaks?: boolean
}

/** @public */
export enum TextEditorControl {
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

interface I18n {
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

export interface ColorsTheme {
  colors: string[]
  defaultColor: string
}

interface Theme {
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
  controls: {
    colors: ColorsTheme
    headings: Heading['level'][]
  }
}

/** @public */
export interface TextEditorPluginConfig {
  placeholder: string
  controls: TextEditorControl[]
  i18n: I18n
  theme: Theme
  blockquote?: string
  noLinebreaks?: boolean
}
