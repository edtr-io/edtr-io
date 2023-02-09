import { styled } from '@edtr-io/ui'
import React from 'react'

import { HoveringToolbarButtonProps } from '../types'

const Button = styled.button<{
  active?: boolean
}>(({ active, theme }) => ({
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
  padding: '0px',
  width: '25px',
  '&:hover': {
    color: theme.hoverColor,
  },
}))

export const HoveringToolbarButton = ({
  editor,
  config,
  control,
  index,
  onMouseDown,
}: HoveringToolbarButtonProps) => (
  <Button
    active={control.isActive(editor)}
    theme={config.theme}
    title={control.title}
    onMouseDown={(event) => {
      onMouseDown(event, control, index)
    }}
  >
    {control.renderIcon()}
  </Button>
)
