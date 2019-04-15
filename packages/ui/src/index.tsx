import {
  defaultEditorTheme,
  EditorTheme,
  EditorUiTheme
} from '@edtr-io/editor-ui'
import {
  defaultRendererTheme,
  RendererTheme,
  RendererUiTheme
} from '@edtr-io/renderer-ui'
import * as R from 'ramda'
import * as React from 'react'
import styled, {
  ThemeConsumer as StyledThemeConsumer,
  ThemeProps as StyledThemeProps,
  ThemeProvider as StyledThemeProvider,
  ThemeProviderProps as StyledThemeProviderProps
} from 'styled-components'

export { styled }

export interface Theme {
  editor: EditorTheme
  editorUi: DeepPartial<EditorUiTheme>
  renderer: RendererTheme
  rendererUi: DeepPartial<RendererUiTheme>
  plugins: Record<string, unknown>
}

export type CustomTheme = DeepPartial<Theme>
export type ThemeProps = StyledThemeProps<Theme>

const defaultTheme: Theme = {
  editor: defaultEditorTheme,
  editorUi: {},
  renderer: defaultRendererTheme,
  rendererUi: {},
  plugins: {}
}

export function RootThemeProvider(
  props: StyledThemeProviderProps<CustomTheme>
) {
  const theme = R.mergeDeepRight(defaultTheme, props.theme)
  return <StyledThemeProvider {...props} theme={theme} />
}

export const ThemeConsumer: React.Context<
  Theme
>['Consumer'] = StyledThemeConsumer
export function ThemeProvider(props: StyledThemeProviderProps<CustomTheme>) {
  return (
    <ThemeConsumer>
      {defaultTheme => {
        const theme = R.mergeDeepRight(defaultTheme, props.theme)
        return <StyledThemeProvider {...props} theme={theme} />
      }}
    </ThemeConsumer>
  )
}

export function createPluginTheme<T>(
  createDefaultTheme: (theme: {
    editor: EditorTheme
    renderer: RendererTheme
  }) => T
) {
  return (pluginName: string, theme: Theme): T => {
    return (R.mergeDeepRight(
      createDefaultTheme(theme),
      (theme.plugins[pluginName] as DeepPartial<T>) || {}
    ) as unknown) as T
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (DeepPartial<U>)[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}
