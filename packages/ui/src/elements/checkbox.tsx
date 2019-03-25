import * as React from 'react'
import { defaultTheming, EditorTheming, styled } from '..'
import { ThemeProps } from 'styled-components'

const CheckboxLabel = styled.label((props: ThemeProps<EditorTheming>) => ({
  color: props.theme.textColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '20px'
}))
CheckboxLabel.defaultProps = { theme: defaultTheming }

const CheckboxToggleContainer = styled.div<{ value?: boolean }>(
  ({ value, theme }: { value?: boolean; theme: EditorTheming }) => {
    return {
      cursor: 'pointer',
      border: `2px solid ${theme.textColor}`,
      borderRadius: '15%',
      width: '10px',
      height: '10px',
      display: 'inline-block',
      backgroundColor: value ? theme.textColor : theme.backgroundColor
    }
  }
)
CheckboxToggleContainer.defaultProps = { theme: defaultTheming }

const CheckboxLabelInner = styled.span({ width: '20%' })

const CheckboxToggle = styled.div<{ value?: boolean }>(
  ({ value, theme }: { value?: boolean; theme: EditorTheming }) => {
    return {
      opacity: value ? 1 : 0,
      content: '',
      position: 'absolute',
      fontWeight: 'bold',
      width: '8px',
      height: '5px',
      border: `2px solid ${theme.backgroundColor}`,
      borderTop: 'none',
      borderRight: 'none',

      transform: 'rotate(-45deg)',
      zIndex: 1000
    }
  }
)
CheckboxToggle.defaultProps = { theme: defaultTheming }

const CheckboxInner = styled.div({
  width: '75%',
  textAlign: 'left'
})
export class Checkbox extends React.Component<CheckboxProps> {
  public render() {
    const { checked, onChange, label } = this.props
    return (
      <CheckboxLabel>
        <CheckboxLabelInner>{label}</CheckboxLabelInner>
        <CheckboxInner>
          <CheckboxToggleContainer
            onClick={() => {
              if (onChange) {
                onChange(!checked)
              }
            }}
            value={checked}
          >
            <CheckboxToggle value={checked} />
          </CheckboxToggleContainer>
        </CheckboxInner>
      </CheckboxLabel>
    )
  }
}

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}
