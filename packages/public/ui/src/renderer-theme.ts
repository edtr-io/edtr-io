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
export interface ExpandableBoxTheme {
  containerBorderColor: string
  toggleBackgroundColor: string
  toggleColor: string
}

export interface SubmitButtonTheme {
  backgroundColor: string
  hoverBackgroundColor: string
  color: string
  correctBackgroundColor: string
  wrongBackgroundColor: string
}

export interface InputExerciseFieldTheme {
  borderStyle: string
  borderColor: string
  correctBorderColor: string
  wrongBorderColor: string
}

export interface RendererUiTheme {
  expandableBox: ExpandableBoxTheme
  submitButton: SubmitButtonTheme
  inputExerciseField: InputExerciseFieldTheme
}

export type RendererThemeProps = StyledThemeProps<{
  renderer: RendererTheme
  rendererUi: RendererUiTheme
}>

export function useRendererTheme(): {
  renderer: RendererTheme
  rendererUi: RendererUiTheme
} {
  return React.useContext(StyledThemeContext)
}

export function createRendererUiTheme<T extends object>(
  createDefaultTheme: (theme: RendererTheme) => T
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
export function useRendererUiTheme<T extends object>(
  key: keyof RendererUiTheme,
  createDefaultTheme: RendererUiThemeFactory<T>
) {
  const theme = useRendererTheme()
  return createRendererUiTheme(createDefaultTheme)(key, theme)
}

export type RendererUiThemeFactory<T> = (theme: RendererTheme) => T

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (DeepPartial<U>)[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : DeepPartial<T[P]>
}
