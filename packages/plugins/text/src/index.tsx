import {
  EditorPlugin,
  EditorPluginProps,
  serializedScalar,
  SerializedScalarStateType,
  StateTypeValueType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as React from 'react'
import { Descendant, Range, BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

import { isValueEmpty } from './factory'
import { TextEditor } from './factory/editor'
import type { SlatePluginClosure } from './factory/types'

// TODO: Move to a better place
const emptyDocument: StateTypeValueType<TextPluginState> = {
  value: [{ type: 'paragraph', children: [{ text: '' }] }],
  selection: null,
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

export { isValueEmpty, SlatePluginClosure }
export type { SlateClosure } from './factory/types'

// TODO: We need to configure this!
interface CustomElement {
  type: 'paragraph'
  children: CustomText[]
}
interface CustomText {
  text: string
  strong?: true
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
