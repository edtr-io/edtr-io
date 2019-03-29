import { defaultTheming, styled, EditorTheming } from '@edtr-io/ui'

export const ButtonGroup = styled.div({
  position: 'absolute',
  top: '-1em',
  zIndex: 20
})

export const Button = styled.button<{ active?: boolean }>(
  ({ active, theme }: { active?: boolean; theme: EditorTheming }) => {
    return {
      backgroundColor: theme.backgroundColor,
      cursor: 'pointer',
      color: active ? theme.highlightColor : theme.textColor,
      outline: 'none',
      height: '25px',
      border: 'none',
      width: '40px',
      borderRight: `1px solid ${theme.textColor}`,
      '&:first-child': {
        borderBottomLeftRadius: '8px',
        borderTopLeftRadius: '8px'
      },
      '&:last-child': {
        borderBottomRightRadius: '8px',
        borderTopRightRadius: '8px',
        border: 'none'
      },
      '&:hover': {
        color: theme.highlightColor
      }
    }
  }
)
Button.defaultProps = { theme: defaultTheming }
