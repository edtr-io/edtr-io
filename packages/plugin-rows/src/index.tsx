import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import { createPluginTheme, PluginThemeFactory } from '@edtr-io/ui'
import * as React from 'react'

import { RowsEditor } from './editor'
import { RowsRenderer } from './renderer'

export const rowState = StateType.child()
export const rowsState = StateType.list(rowState, 1)

function createRowsComponent(plugins?: PluginRegistry) {
  return function RowsComponent(
    props: StatefulPluginEditorProps<typeof rowsState>
  ) {
    return props.editable ? (
      <RowsEditor {...props} plugins={plugins} />
    ) : (
      <RowsRenderer {...props} />
    )
  }
}

export function createRowsPlugin(
  plugins?: PluginRegistry
): StatefulPlugin<typeof rowsState> {
  return {
    Component: createRowsComponent(plugins),
    state: rowsState,
    getFocusableChildren(state) {
      return state()
    }
  }
}

export const rowsPlugin = createRowsPlugin()

export type PluginRegistry = {
  name: string
  title?: string
  icon?: React.ComponentType
  description?: string
}[]

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
