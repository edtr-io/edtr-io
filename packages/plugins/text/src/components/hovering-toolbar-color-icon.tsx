import { styled } from '@edtr-io/ui'

export const HoveringToolbarColorIcon = styled.div<{ color: string }>(
  ({ color }) => ({
    display: 'inline-block',
    backgroundColor: color,
    borderRadius: ' 100%',
    width: '19px',
    height: '19px',
    margin: '3px',
    verticalAlign: 'middle',
  })
)
