import { defaultTheming, styled, Theming } from '@edtr-io/ui'

export const ButtonGroup = styled.div({
  display: 'flex',
  width: '100%',
  margin: '20px 0 0'
})

export const Button = styled.button<{ active?: boolean }>(
  ({ active, theme }: { active?: boolean; theme: Theming }) => {
    return {
      backgroundColor: theme.backgroundColor,
      cursor: 'pointer',
      color: active ? theme.highlightColor : theme.textColor,
      outline: 'none',
      height: '25px',
      border: 'none',
      maxWidth: '40px',
      flex: 1,
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
