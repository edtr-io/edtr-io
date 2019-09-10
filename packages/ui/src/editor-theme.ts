import * as R from 'ramda'
import * as React from 'react'
import {
  ThemeProps as StyledThemeProps,
  ThemeContext as StyledThemeContext
} from 'styled-components'

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

export const defaultEditorTheme: EditorTheme = {
  primary: {
    color: '#ffffff',
    background: 'rgb(70, 155, 255)'
  },
  secondary: {
    color: '#333333',
    background: '#eeeeee'
  },
  success: {
    color: '#ffffff',
    background: '#5cb85c'
  },
  info: {
    color: '#ffffff',
    background: '#5bc0de'
  },
  warning: {
    color: '#ffffff',
    background: '#f0ad4e'
  },
  danger: {
    color: '#ffffff',
    background: '#d9534f'
  },
  color: '#EEEEEE',
  backgroundColor: 'rgba(51,51,51,0.95)'
}

export interface ButtonTheme {
  backgroundColor: string
  color: string
  borderColor: string
  hoverBackgroundColor: string
  hoverColor: string
  hoverBorderColor: string
}

export interface CheckboxTheme {
  boxSelectedColor: string
  boxDeselectedColor: string
  color: string
}

export interface InputTheme {
  backgroundColor: string
  color: string
  highlightColor: string
}

export interface TextareaTheme {
  backgroundColor: string
  color: string
  borderColor: string
  highlightColor: string
}

export interface OverlayTheme {
  backgroundColor: string
  color: string
  overlayBackgroundColor: string
  highlightColor: string
  button: ButtonTheme
  checkbox: CheckboxTheme
  input: InputTheme
  textarea: TextareaTheme
}

export interface EditorUiTheme {
  button: ButtonTheme
  checkbox: CheckboxTheme
  input: InputTheme
  overlay: OverlayTheme
  textarea: TextareaTheme
}

export type EditorThemeProps = StyledThemeProps<{
  editor: EditorTheme
  editorUi: EditorUiTheme
}>

export function useEditorTheme(): {
  editor: EditorTheme
  editorUi: EditorUiTheme
} {
  return React.useContext(StyledThemeContext)
}

export function createEditorUiTheme<T>(
  createDefaultTheme: EditorUiThemeFactory<T>
) {
  return (
    key: keyof EditorUiTheme,
    theme: { editor: EditorTheme; editorUi: EditorUiTheme }
  ): T => {
    return (R.mergeDeepRight(
      createDefaultTheme(theme.editor),
      ((theme.editorUi[key] as unknown) as DeepPartial<T>) || {}
    ) as unknown) as T
  }
}
export function useEditorUiTheme<T>(
  key: keyof EditorUiTheme,
  createDefaultTheme: EditorUiThemeFactory<T>
) {
  const theme = useEditorTheme()
  return createEditorUiTheme(createDefaultTheme)(key, theme)
}

export type EditorUiThemeFactory<T> = (theme: EditorTheme) => T

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (DeepPartial<U>)[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>
}
