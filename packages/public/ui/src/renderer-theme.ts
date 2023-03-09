import * as R from 'ramda'
import * as React from 'react'
import {
  ThemeContext as StyledThemeContext,
  ThemeProps as StyledThemeProps,
} from 'styled-components'

import { DeepPartial } from './deep-partial'

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
    background: '#337ab7',
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
}

/** @public */
export interface RendererUiTheme {
  expandableBox: {
    containerBorderColor: string
    toggleBackgroundColor: string
    toggleColor: string
  }
  submitButton: {
    backgroundColor: string
    hoverBackgroundColor: string
    color: string
    correctBackgroundColor: string
    wrongBackgroundColor: string
  }
}

/** @public */
export type RendererThemeProps = StyledThemeProps<{
  renderer: RendererTheme
  rendererUi: DeepPartial<RendererUiTheme>
}>

/**
 * React Hook for the renderer theming
 *
 * @returns An object containing the current {@link RendererTheme | renderer theme} and {@link RendererUiTheme | renderer UI theme}
 * @public
 */
export function useRendererTheme() {
  return React.useContext<{
    renderer: RendererTheme
    rendererUi: DeepPartial<RendererUiTheme>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }>(StyledThemeContext)
}

/**
 * Creates a function that maps {@link RendererThemeProps} to the current theme of the specified renderer UI component
 *
 * @param key - The renderer UI component
 * @param createDefaultTheme - The {@link RendererUiThemeFactory | factory} for the default theme
 * @returns A function that accepts {@link RendererThemeProps} and returns the current theme of the specified component
 * @public
 */
export function createRendererUiTheme<K extends keyof RendererUiTheme>(
  key: K,
  createDefaultTheme: RendererUiThemeFactory<K>
) {
  return (theme: {
    renderer: RendererTheme
    rendererUi: DeepPartial<RendererUiTheme>
  }): RendererUiTheme[K] => {
    return R.mergeDeepRight(
      createDefaultTheme(theme.renderer),
      (theme.rendererUi[key] || {}) as unknown as DeepPartial<
        RendererUiTheme[K]
      >
    ) as unknown as RendererUiTheme[K]
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
export function useRendererUiTheme<K extends keyof RendererUiTheme>(
  key: K,
  createDefaultTheme: RendererUiThemeFactory<K>
) {
  const theme = useRendererTheme()
  return createRendererUiTheme(key, createDefaultTheme)(theme)
}

/** @public */
export type RendererUiThemeFactory<K extends keyof RendererUiTheme> = (
  theme: RendererTheme
) => RendererUiTheme[K]
