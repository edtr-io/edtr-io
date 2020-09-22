import { styled } from '@edtr-io/ui'

import { MathEditorConfig } from './editor-config'

export const Dropdown = styled.select<{ config: MathEditorConfig }>((props) => {
  const { theme } = props.config
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
      color: theme.hoverColor,
    },
  }
})

export const Option = styled.option<{
  config: MathEditorConfig
  active?: boolean
}>((props) => {
  const { theme } = props.config
  return {
    backgroundColor: props.active
      ? theme.active.backgroundColor
      : theme.dropDown.backgroundColor,
    color: props.active ? theme.active.color : theme.color,
    cursor: 'pointer',
    '&:hover': {
      color: theme.hoverColor,
    },
  }
})
