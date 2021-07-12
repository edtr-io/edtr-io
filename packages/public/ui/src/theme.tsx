import * as R from 'ramda'
import * as React from 'react'
import * as StyledComponents from 'styled-components'

import { DeepPartial } from './deep-partial'
import { defaultEditorTheme, EditorTheme, EditorUiTheme } from './editor-theme'
import {
  defaultRendererTheme,
  RendererTheme,
  RendererUiTheme,
} from './renderer-theme'

/**
 * Interface of an Edtr.io theme
 *
  @public */
export interface Theme {
  editor: EditorTheme
  editorUi: DeepPartial<EditorUiTheme>
  renderer: RendererTheme
  rendererUi: DeepPartial<RendererUiTheme>
}

/**
 * Helper type to be used to override the theme
 *
 * @public
 */
export type CustomTheme = DeepPartial<Theme>

/**
 * Props that any styled-components automatically receive, see also {@link https://styled-components.com/docs/advanced#theming | Theming }
 *
 * @public
 */
export type ThemeProps = StyledComponents.ThemeProps<Theme>

const defaultTheme: Theme = {
  editor: defaultEditorTheme,
  editorUi: {},
  renderer: defaultRendererTheme,
  rendererUi: {},
}

/**
 * Provider to hydrate the context for the {@link Theme | Theme}
 *
 * @remarks
 * You probably don't want to use this component directly since it is already used by the core.
 * If you want to override the theme in some plugin, you probably want to use {@link ThemeProvider | ThemeProvider} instead.
 * @param props - A {@link CustomTheme | CustomTheme} that will be deeply merged with the {@link Theme | default Theme}, and children
 * @public
 */
export function RootThemeProvider(
  props: StyledComponents.ThemeProviderProps<CustomTheme>
) {
  const theme = React.useMemo(
    () => R.mergeDeepRight(defaultTheme, props.theme),
    [props.theme]
  )
  return <StyledComponents.ThemeProvider {...props} theme={theme} />
}

/**
 * Context used for the {@link Theme | Theme}, see also {@link https://styled-components.com/docs/advanced#theming | Theming }
 *
 * @public
 */
export const ThemeContext: React.Context<Theme> = StyledComponents.ThemeContext

/**
 * React Hook to get the current {@link Theme | Theme}
 *
 * @returns The current {@link Theme | Theme}
 * @public
 */
export function useTheme() {
  return React.useContext(ThemeContext)
}

/**
 * Provider to override the current {@link Theme | theme}
 *
 * @param props - A {@link CustomTheme | CustomTheme} that will be deeply merged with the {@link Theme | current Theme}, and children
 * @public
 */
export function ThemeProvider(
  props: StyledComponents.ThemeProviderProps<CustomTheme>
) {
  const defaultTheme = useTheme()
  const theme = React.useMemo(() => {
    return R.mergeDeepRight(defaultTheme, props.theme)
  }, [defaultTheme, props.theme])
  return <StyledComponents.ThemeProvider {...props} theme={theme} />
}
