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
  ThemeContext as StyledThemeContext,
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
  const theme = React.useMemo(
    () => R.mergeDeepRight(defaultTheme, props.theme),
    [props.theme]
  )
  return <StyledThemeProvider {...props} theme={theme} />
}

export const ThemeContext: React.Context<Theme> = StyledThemeContext
export const ThemeConsumer: React.Context<Theme>['Consumer'] =
  ThemeContext.Consumer
export function useTheme() {
  return React.useContext(ThemeContext)
}

export function ThemeProvider(props: StyledThemeProviderProps<CustomTheme>) {
  const defaultTheme = useTheme()
  const theme = React.useMemo(() => {
    return R.mergeDeepRight(defaultTheme, props.theme)
  }, [props.theme, defaultTheme])
  return <StyledThemeProvider {...props} theme={theme} />
}

export function createPluginTheme<T>(
  createDefaultTheme: PluginThemeFactory<T>
) {
  return (pluginName: string, theme: Theme): T => {
    return (R.mergeDeepRight(
      createDefaultTheme(theme),
      (theme.plugins[pluginName] as DeepPartial<T>) || {}
    ) as unknown) as T
  }
}
export function usePluginTheme<T>(
  pluginName: string,
  createDefaultTheme: PluginThemeFactory<T>
) {
  const theme = useTheme()
  return React.useMemo(
    () => createPluginTheme(createDefaultTheme)(pluginName, theme),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  )
}

export type PluginThemeFactory<T> = (theme: {
  editor: EditorTheme
  renderer: RendererTheme
}) => T

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (DeepPartial<U>)[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}
