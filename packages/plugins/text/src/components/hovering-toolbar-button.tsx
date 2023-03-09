import { styled } from '@edtr-io/ui'

export const HoveringToolbarButton = styled.button<{
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
  borderRadius: theme.borderRadius,
  margin: '5px',
  padding: '0px',
  width: '25px',
  '&:hover': {
    color: theme.hoverColor,
  },
}))
