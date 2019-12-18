import { child, list, EditorPluginProps, EditorPlugin } from '@edtr-io/plugin'
import { createPluginTheme, PluginThemeFactory } from '@edtr-io/ui'
import * as React from 'react'

import { RowsEditor } from './editor'

const rowState = child()
const rowsState = list(rowState, 1)
export type RowsState = typeof rowsState
export interface RowsConfig {
  plugins: {
    name: string
    title?: string
    icon?: React.ComponentType
    description?: string
  }[]
}
export type RowsProps = EditorPluginProps<RowsState, RowsConfig>

export function createRowsPlugin(
  config: RowsConfig
): EditorPlugin<RowsState, RowsConfig> {
  return {
    Component: RowsEditor,
    config,
    state: rowsState
  }
}

export interface RowTheme {
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

export const rowsPluginThemeFactory: PluginThemeFactory<RowTheme> = theme => {
  return {
    color: theme.editor.secondary.color, // rgb(51,51,51) #333333
    backgroundColor: theme.editor.primary.color, // #fff
    highlightColor: theme.editor.primary.background, // rgb(70, 155, 255) #469bff
    lightBackgroundColor: 'rgb(182,182,182)',
    menu: {
      highlightColor: theme.editor.primary.background, // rgb(70, 155, 255) #469bff
      primary: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: theme.editor.backgroundColor // rgb(51,51,51,0.95) #333333??
      },
      secondary: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        color: '#999999'
      },
      dropzone: {
        backgroundColor: 'rgb(73, 73, 73)',
        color: '#dbdbdb',
        highlightColor: theme.editor.primary.background,
        highlightBackgroundColor: 'rgb(60,60,60)'
      }
    }
  }
}

export const createRowPluginTheme = createPluginTheme<RowTheme>(
  rowsPluginThemeFactory
)
