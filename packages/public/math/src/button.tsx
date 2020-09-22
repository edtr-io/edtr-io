import { styled } from '@edtr-io/ui'

import { MathEditorConfig } from './editor-config'

export const Button = styled.button(
  (props: { active?: boolean; config: MathEditorConfig }) => {
    const { theme } = props.config
    return {
      backgroundColor: props.active
        ? theme.active.backgroundColor
        : theme.backgroundColor,
      cursor: 'pointer',
      boxShadow: props.active
        ? 'inset 0 1px 3px 0 rgba(0,0,0,0.50)'
        : undefined,
      color: props.active ? theme.active.color : theme.color,
      outline: 'none',
      height: '25px',
      border: 'none',
      borderRadius: '4px',
      margin: '5px',
      padding: '0px',
      width: '25px',
      '&:hover': {
        color: theme.hoverColor,
      },
    }
  }
)
