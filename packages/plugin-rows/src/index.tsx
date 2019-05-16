import * as React from 'react'
import {
  StatefulPlugin,
  StatefulPluginEditorProps,
  StateType
} from '@edtr-io/core'
import { createPluginTheme } from '@edtr-io/ui'

import { RowsEditor } from './editor'
import { RowsRenderer } from './renderer'

export const rowState = StateType.child()
export const rowsState = StateType.list(rowState, 1)

const RowsPlugin = (props: StatefulPluginEditorProps<typeof rowsState>) => {
  return props.editable ? (
    <RowsEditor {...props} />
  ) : (
    <RowsRenderer {...props} />
  )
}

export const rowsPlugin: StatefulPlugin<typeof rowsState> = {
  Component: RowsPlugin,
  state: rowsState,
  getFocusableChildren(state) {
    return state()
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
  }
}

export const createRowPluginTheme = createPluginTheme<RowTheme>(theme => {
  return {
    backgroundColor: theme.editor.backgroundColor,
    color: theme.editor.color,
    highlightColor: theme.editor.primary.background,
    lightBackgroundColor: theme.editor.primary.color,
    menu: {
      highlightColor: theme.editor.primary.background,
      primary: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: theme.editor.backgroundColor
      },
      secondary: {
        backgroundColor: '#f5f5f5',
        color: 'rgba(51,51,51)'
      }
    }
  }
})
