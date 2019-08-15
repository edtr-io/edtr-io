import { styled, ThemeProps } from '@edtr-io/ui'

import { createTextPluginTheme } from '..'

export const Dropdown = styled.select(
  (props: { name: string } & ThemeProps) => {
    const theme = createTextPluginTheme(props.name, props.theme)
    return {
      backgroundColor: theme.backgroundColor,
      cursor: 'pointer',
      color: theme.color,
      outline: 'none',
      height: '25px',
      border: 'none',
      borderRadius: '4px',
      margin: '5px',
      '&:hover': {
        color: theme.hoverColor
      }
    }
  }
)

export const Option = styled.option(
  (props: ThemeProps & { active?: boolean; name: string }) => {
    const theme = createTextPluginTheme(props.name, props.theme)
    return {
      backgroundColor: props.active
        ? theme.active.backgroundColor
        : theme.dropDown.backgroundColor,
      color: props.active ? theme.active.color : theme.color,
      cursor: 'pointer',
      '&:hover': {
        color: theme.hoverColor
      }
    }
  }
)
