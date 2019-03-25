import { defaultTheming, EditorTheming, styled } from '@edtr-io/ui'
import { ThemeProps } from 'styled-components'

export const Button = styled.button((props: ThemeProps<EditorTheming>) => {
  return {
    margin: '3px',
    backgroundColor: props.theme.buttonBackgroundColor,
    outline: 'none',
    border: `2px solid ${props.theme.textColor}`,
    color: props.theme.textColor,
    padding: '10px',
    borderRadius: '4px',
    minWidth: '125px',
    cursor: 'pointer',
    '&:hover': {
      color: props.theme.highlightColor,
      borderColor: props.theme.highlightColor
    }
  }
})
Button.defaultProps = {
  theme: defaultTheming
}
