import * as R from 'ramda'
import styled, { ThemeProps as StyledThemeProps } from 'styled-components'

import { ExpandableBoxTheme } from './components'

export { styled }

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

export interface RendererUiTheme {
  expandableBox: ExpandableBoxTheme
}

export type RendererThemeProps = StyledThemeProps<{
  renderer: RendererTheme
  rendererUi: RendererUiTheme
}>

export function createRendererUiElementTheme<T>(
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

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? (DeepPartial<U>)[]
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}
