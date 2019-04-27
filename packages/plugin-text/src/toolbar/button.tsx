import { styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import { createTextPluginTheme } from '..'

export const Button = styled.button<{ active?: boolean }>(
  ({ active, ...props }: { active?: boolean } & ThemeProps) => {
    const theme = createTextPluginTheme(name, props.theme)
    return {
      backgroundColor: active
        ? theme.active.backgroundColor
        : theme.backgroundColor,
      cursor: 'pointer',
      boxShadow: active ? 'inset 0 1px 3px 0 rgba(0,0,0,0.50)' : undefined,
      color: active ? theme.active.color : theme.color,
      outline: 'none',
      height: '25px',
      border: 'none',
      borderRadius: '4px',
      margin: '5px',
      width: '25px',
      '&:hover': {
        color: theme.hoverColor
      }
    }
  }
)

export interface ButtonTheme {
  activeBackgroundColor: string
  activeColor: string
  color: string
  hoverColor: string
}
