/**
 * @module @edtr-io/ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as R from 'ramda'
import * as React from 'react'
import {
  ThemeContext as StyledThemeContext,
  ThemeProps as StyledThemeProps
} from 'styled-components'

import { DeepPartial } from './types'

/** @public */
export interface RendererTheme {
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
export const defaultRendererTheme: RendererTheme = {
  backgroundColor: '#ffffff',
  color: '#333333',
  primary: {
    color: '#ffffff',
    background: '#337ab7'
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
  }
}

/** @public */
export interface ExpandableBoxTheme {
  containerBorderColor: string
  toggleBackgroundColor: string
  toggleColor: string
}

/** @public */
export interface SubmitButtonTheme {
  backgroundColor: string
  hoverBackgroundColor: string
  color: string
  correctBackgroundColor: string
  wrongBackgroundColor: string
}

/** @public */
export interface RendererUiTheme {
  expandableBox: ExpandableBoxTheme
  submitButton: SubmitButtonTheme
}

/** @public */
export type RendererThemeProps = StyledThemeProps<{
  renderer: RendererTheme
  rendererUi: RendererUiTheme
}>

/**
 * React Hook for the renderer theming
 *
 * @returns An object containing the current {@link RendererTheme | renderer theme} and {@link RendererUiTheme | renderer UI theme}
 * @public
 */
export function useRendererTheme(): {
  renderer: RendererTheme
  rendererUi: RendererUiTheme
} {
  return React.useContext(StyledThemeContext)
}

/**
 * Creates a function that maps {@link RendererThemeProps} to the current theme of the specified renderer UI component
 *
 * @param createDefaultTheme - The {@link RendererUiThemeFactory | factory} for the default theme
 * @returns A function that accepts an renderer UI component and {@link RendererThemeProps} and returns the current theme of the specified component
 * @public
 */
export function createRendererUiTheme<T extends object>(
  createDefaultTheme: RendererUiThemeFactory<T>
) {
  return (
    key: keyof RendererUiTheme,
    theme: { renderer: RendererTheme; rendererUi: RendererUiTheme }
  ): T => {
    return (R.mergeDeepRight(
      createDefaultTheme(theme.renderer),
      ((theme.rendererUi[key] as unknown) as DeepPartial<T>) || {}
    ) as unknown) as T
  }
}

/**
 * React Hook for the theme of a renderer UI component
 *
 * @param key - The renderer UI component
 * @param createDefaultTheme - The {@link RendererUiThemeFactory | factory} for the default theme
 * @returns The current theme of the specified component
 * @public
 */
export function useRendererUiTheme<T extends object>(
  key: keyof RendererUiTheme,
  createDefaultTheme: RendererUiThemeFactory<T>
) {
  const theme = useRendererTheme()
  return createRendererUiTheme(createDefaultTheme)(key, theme)
}

/** @public */
export type RendererUiThemeFactory<T> = (theme: RendererTheme) => T
