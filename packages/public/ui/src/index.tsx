/**
 * @module @edtr-io/ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as R from 'ramda'
import * as React from 'react'
import styled, {
  ThemeContext as StyledThemeContext,
  ThemeProps as StyledThemeProps,
  ThemeProvider as StyledThemeProvider,
  ThemeProviderProps as StyledThemeProviderProps
} from 'styled-components'

import { defaultEditorTheme, EditorTheme, EditorUiTheme } from './editor-theme'
import {
  defaultRendererTheme,
  RendererTheme,
  RendererUiTheme
} from './renderer-theme'
import { DeepPartial } from './types'

export { styled }

/** @public */
export interface Theme {
  editor: EditorTheme
  editorUi: DeepPartial<EditorUiTheme>
  renderer: RendererTheme
  rendererUi: DeepPartial<RendererUiTheme>
}

/** @public */
export type CustomTheme = DeepPartial<Theme>
/** @public */
export type ThemeProps = StyledThemeProps<Theme>

const defaultTheme: Theme = {
  editor: defaultEditorTheme,
  editorUi: {},
  renderer: defaultRendererTheme,
  rendererUi: {}
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Provider to hydrate the context for the theme {@link Theme | theme}
 *
 * @param props - A {@link CustomTheme | custom theme} that will be deep merged with the default theme, and children
 * @public
 */
export function RootThemeProvider(
  props: StyledThemeProviderProps<CustomTheme>
) {
  const theme = React.useMemo(
    () => R.mergeDeepRight(defaultTheme, props.theme),
    [props.theme]
  )
  return <StyledThemeProvider {...props} theme={theme} />
}

/** @public */
export const ThemeContext: React.Context<Theme> = StyledThemeContext
/** @public */
export const ThemeConsumer: React.Context<Theme>['Consumer'] =
  ThemeContext.Consumer
/**
 * React Hook for the editor theming
 *
 * @returns The current {@link Theme | theme}
 * @public
 */
export function useTheme() {
  return React.useContext(ThemeContext)
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Provider to override the current {@link Theme | theme}
 *
 * @param props - A {@link CustomTheme | custom theme} that will be deep merged with the current theme, and children
 * @public
 */
export function ThemeProvider(props: StyledThemeProviderProps<CustomTheme>) {
  const defaultTheme = useTheme()
  const theme = React.useMemo(() => {
    return R.mergeDeepRight(defaultTheme, props.theme)
  }, [defaultTheme, props.theme])
  return <StyledThemeProvider {...props} theme={theme} />
}

export * from './editor-theme'
export * from './renderer-theme'
export * from './icon'
export * from './types'
