import * as R from 'ramda'
import * as React from 'react'
import styled, {
  ThemeProps,
  ThemeProvider,
  ThemeProviderProps
} from 'styled-components'

import {
  ButtonTheme,
  CheckboxTheme,
  InputTheme,
  OverlayTheme,
  TextareaTheme
} from './elements'

export { styled }

export interface EditorTheming {
  highlightColor: string
  textColor: string
  backgroundColor: string
  buttonBackgroundColor: string
}

export const defaultTheming: EditorTheming = {
  highlightColor: 'rgb(70, 155, 255)',
  textColor: '#EEEEEE',
  backgroundColor: 'rgb(51,51,51,0.95)',
  buttonBackgroundColor: 'transparent'
}

export interface EditorTheme {
  editor: {
    highlightColor: string
    color: string
    backgroundColor: string
  }
  renderer: {
    highlightColor: string
    color: string
    backgroundColor: string
  }
  ui: {
    button?: Partial<ButtonTheme>
    checkbox?: Partial<CheckboxTheme>
    input?: Partial<InputTheme>
    overlay?: Partial<OverlayTheme>
    textarea?: Partial<TextareaTheme>
  }
  plugins: Record<string, unknown>
}

export interface CustomEditorTheme {
  editor?: Partial<EditorTheme['editor']>
  renderer?: Partial<EditorTheme['renderer']>
  ui?: EditorTheme['ui']
  plugins?: EditorTheme['plugins']
}

export type EditorThemeProps = ThemeProps<EditorTheme>

const defaultTheme: EditorTheme = {
  editor: {
    highlightColor: 'rgb(70, 155, 255)',
    color: '#EEEEEE',
    backgroundColor: 'rgb(51,51,51,0.95)'
  },
  renderer: {
    color: '#000',
    backgroundColor: '#f8f8f8',
    highlightColor: '#d9edf7'
  },
  ui: {},
  plugins: {}
}

export function EditorThemeProvider(
  props: ThemeProviderProps<CustomEditorTheme>
) {
  const theme = R.mergeDeepRight(defaultTheme, props.theme)

  return <ThemeProvider {...props} theme={theme} />
}

export function createUiElementTheme<T>(
  createDefaultTheme: (theme: EditorTheme['editor']) => T
) {
  return (key: keyof EditorTheme['ui'], theme: EditorTheme): T => {
    return (R.mergeDeepRight(
      createDefaultTheme(theme.editor),
      (theme.ui[key] as Partial<T>) || {}
    ) as unknown) as T
  }
}

export function createPluginTheme<T>(
  createDefaultTheme: (theme: EditorTheme['renderer']) => T
) {
  return (pluginName: string, theme: EditorTheme): T => {
    return (R.mergeDeepRight(
      createDefaultTheme(theme.renderer),
      (theme.plugins[pluginName] as Partial<T>) || {}
    ) as unknown) as T
  }
}
