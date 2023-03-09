import * as R from 'ramda'
import * as React from 'react'
import {
  ThemeProps as StyledThemeProps,
  ThemeContext as StyledThemeContext,
} from 'styled-components'

import { DeepPartial } from './deep-partial'

/** @public */
export interface EditorTheme {
  backgroundColor: string
  color: string
  primary: {
    color: string
    background: string
  }
  secondary: {
    color: string
    background: string
  }
  success: {
    color: string
    background: string
  }
  info: {
    color: string
    background: string
  }
  warning: {
    color: string
    background: string
  }
  danger: {
    color: string
    background: string
  }
}

/** @public */
export const defaultEditorTheme: EditorTheme = {
  primary: {
    color: '#ffffff',
    background: 'rgb(70, 155, 255)',
  },
  secondary: {
    color: '#333333',
    background: '#eeeeee',
  },
  success: {
    color: '#ffffff',
    background: '#5cb85c',
  },
  info: {
    color: '#ffffff',
    background: '#5bc0de',
  },
  warning: {
    color: '#ffffff',
    background: '#f0ad4e',
  },
  danger: {
    color: '#ffffff',
    background: '#d9534f',
  },
  color: '#EEEEEE',
  backgroundColor: 'rgba(51,51,51,0.95)',
}

/** @public */
export interface EditorUiTheme {
  button: {
    backgroundColor: string
    color: string
    borderColor: string
    hoverBackgroundColor: string
    hoverColor: string
    hoverBorderColor: string
  }
  checkbox: {
    boxSelectedColor: string
    boxDeselectedColor: string
    color: string
  }
  input: {
    backgroundColor: string
    color: string
    highlightColor: string
  }
  bottomToolbar: {
    backgroundColor: string
    color: string
  }
}

/** @public */
export type EditorThemeProps = StyledThemeProps<{
  editor: EditorTheme
  editorUi: DeepPartial<EditorUiTheme>
}>

/**
 * React Hook for the editor theming
 *
 * @returns An object containing the current {@link EditorTheme | editor theme} and {@link EditorUiTheme | editor UI theme}
 * @public
 */
export function useEditorTheme() {
  return React.useContext<{
    editor: EditorTheme
    editorUi: DeepPartial<EditorUiTheme>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }>(StyledThemeContext)
}

/**
 * Creates a function that maps {@link EditorThemeProps} to the current theme of the specified editor UI component
 *
 * @param key - The editor UI component
 * @param createDefaultTheme - The {@link EditorUiThemeFactory | factory} for the default theme
 * @returns A function that accepts {@link EditorThemeProps} and returns the current theme of the specified component
 * @public
 */
export function createEditorUiTheme<K extends keyof EditorUiTheme>(
  key: K,
  createDefaultTheme: EditorUiThemeFactory<K>
) {
  return (theme: {
    editor: EditorTheme
    editorUi: DeepPartial<EditorUiTheme>
  }): EditorUiTheme[K] => {
    return R.mergeDeepRight(
      createDefaultTheme(theme.editor),
      (theme.editorUi[key] || {}) as unknown as DeepPartial<EditorUiTheme[K]>
    ) as unknown as EditorUiTheme[K]
  }
}

/**
 * React Hook for the theme of an editor UI component
 *
 * @param key - The editor UI component
 * @param createDefaultTheme - The {@link EditorUiThemeFactory | factory} for the default theme
 * @returns The current theme of the specified component
 * @public
 */
export function useEditorUiTheme<K extends keyof EditorUiTheme>(
  key: K,
  createDefaultTheme: EditorUiThemeFactory<K>
) {
  const theme = useEditorTheme()
  return createEditorUiTheme(key, createDefaultTheme)(theme)
}

/** @public */
export type EditorUiThemeFactory<K extends keyof EditorUiTheme> = (
  theme: EditorTheme
) => EditorUiTheme[K]
