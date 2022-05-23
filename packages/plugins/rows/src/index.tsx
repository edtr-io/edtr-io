import {
  child,
  ChildStateType,
  ChildStateTypeConfig,
  EditorPlugin,
  EditorPluginProps,
  list,
  ListStateType,
} from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'

import { RowsEditor } from './editor'

/**
 * @param config - {@link RowsConfig | Plugin configuration}
 * @public
 */
export function createRowsPlugin(
  config: RowsConfig
): EditorPlugin<RowsPluginState, RowsConfig> {
  const { content } = config

  return {
    Component: RowsEditor,
    config,
    state: list(child(content), 1),
    insertChild(state, { previousSibling, document }) {
      const index = getIndexToInsert()
      if (index === null) return
      state.insert(index, document)

      function getIndexToInsert(): number | null {
        if (!previousSibling) return 0
        const index = R.findIndex(
          (sibling) => sibling.id === previousSibling,
          state
        )
        if (index === -1) return null
        return index + 1
      }
    },

    removeChild(state, id) {
      const index = R.findIndex((child) => child.id === id, state)
      if (index === -1) return
      state.remove(index)
    },
  }
}

/** @public */
export interface RowsConfig extends Omit<RowsPluginConfig, 'i18n' | 'theme'> {
  content: ChildStateTypeConfig
  i18n?: DeepPartial<RowsPluginConfig['i18n']>
  theme?: DeepPartial<RowsPluginConfig['theme']>
}

/** @public */
export type RowsPluginState = ListStateType<ChildStateType>

/** @public */
export interface RowsPluginConfig {
  plugins: {
    name: string
    title?: string
    icon?: React.ComponentType
    description?: string
  }[]
  i18n: {
    menu: {
      searchPlaceholder: string
    }
    settings: {
      duplicateLabel: string
      removeLabel: string
      closeLabel: string
    }
    toolbar: {
      dragLabel: string
    }
    addLabel: string
  }
  theme: {
    backgroundColor: string
    color: string
    highlightColor: string
    lightBackgroundColor: string

    menu: {
      highlightColor: string
      primary: {
        backgroundColor: string
        color: string
      }
      secondary: {
        backgroundColor: string
        color: string
      }
      dropzone: {
        highlightColor: string
        backgroundColor: string
        color: string
        highlightBackgroundColor: string
      }
    }
  }
}

/** @public */
export type RowsProps = EditorPluginProps<RowsPluginState, RowsConfig>

export * from './registry-context'
export * from './store'
