import { child, list, EditorPluginProps, EditorPlugin } from '@edtr-io/plugin'
import * as R from 'ramda'
import * as React from 'react'

import { RowsEditor } from './editor'

const rowState = child()
const rowsState = list(rowState, 1)
export type RowsState = typeof rowsState
interface RowsTheme {
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
export interface RowsConfig {
  plugins: {
    name: string
    title?: string
    icon?: React.ComponentType
    description?: string
  }[]
  theme: RowsTheme
}
export type RowsProps = EditorPluginProps<RowsState, RowsConfig>

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
    state: rowsState
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (DeepPartial<U>)[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>
}
