import { child, EditorPlugin, EditorPluginProps, list } from '@edtr-io/plugin'
import { DeepPartial } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'

import { RowsEditor } from './editor'

const rowState = child()
/** @public */
export const rowsState = list(rowState, 1)
/** @public */
export type RowsState = typeof rowsState
/** @public */
export interface RowsConfig {
  plugins: {
    name: string
    title?: string
    icon?: React.ComponentType
    description?: string
  }[]
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
export type RowsProps = EditorPluginProps<RowsState, RowsConfig>

/** @public */
export function createRowsPlugin({
  plugins,
  theme = {}
}: {
  plugins: RowsConfig['plugins']
  theme?: DeepPartial<RowsConfig['theme']>
}): EditorPlugin<RowsState, RowsConfig> {
  return {
    Component: RowsEditor,
    config: ({ editor }) => {
      return {
        plugins,
        theme: R.mergeDeepRight(
          {
            color: editor.secondary.color,
            backgroundColor: editor.primary.color,
            highlightColor: editor.primary.background,
            lightBackgroundColor: 'rgb(182,182,182)',
            menu: {
              highlightColor: editor.primary.background,
              primary: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: editor.backgroundColor
              },
              secondary: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#999999'
              },
              dropzone: {
                backgroundColor: 'rgb(73, 73, 73)',
                color: '#dbdbdb',
                highlightColor: editor.primary.background,
                highlightBackgroundColor: 'rgb(60,60,60)'
              }
            }
          },
          theme
        )
      }
    },
    state: rowsState,

    insertChild(state, { previousSibling, document }) {
      const index = getIndexToInsert()
      if (index === null) return
      state.insert(index, document)

      function getIndexToInsert(): number | null {
        if (!previousSibling) return 0
        const index = R.findIndex(
          sibling => sibling.id === previousSibling,
          state
        )
        if (index === -1) return null
        return index + 1
      }
    },

    removeChild(state, id) {
      const index = R.findIndex(child => child.id === id, state)
      if (index === -1) return
      state.remove(index)
    }
  }
}
