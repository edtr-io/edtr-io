import * as React from 'react'

import { createEditorUiTheme, EditorThemeProps, styled } from '../theme'

export const createCheckboxTheme = createEditorUiTheme<CheckboxTheme>(theme => {
  return {
    boxSelectedColor: theme.color,
    boxDeselectedColor: theme.backgroundColor,
    color: theme.color
  }
})

const CheckboxLabel = styled.label((props: EditorThemeProps) => {
  const theme = createCheckboxTheme('checkbox', props.theme)

  return {
    color: theme.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '20px'
  }
})

const CheckboxToggleContainer = styled.div<{
  value?: boolean
}>(({ value, ...props }: { value?: boolean } & EditorThemeProps) => {
  const theme = createCheckboxTheme('checkbox', props.theme)

  return {
    cursor: 'pointer',
    border: `2px solid ${theme.color}`,
    borderRadius: '15%',
    width: '10px',
    height: '10px',
    display: 'inline-block',
    backgroundColor: value ? theme.boxSelectedColor : theme.boxDeselectedColor
  }
})

const CheckboxLabelInner = styled.span({ width: '20%' })

const CheckboxToggle = styled.div<{ value?: boolean }>(
  ({ value, ...props }: { value?: boolean } & EditorThemeProps) => {
    const theme = createCheckboxTheme('checkbox', props.theme)

    return {
      opacity: value ? 1 : 0,
      content: '',
      position: 'absolute',
      fontWeight: 'bold',
      width: '8px',
      height: '5px',
      border: `2px solid ${theme.boxDeselectedColor}`,
      borderTop: 'none',
      borderRight: 'none',

      transform: 'rotate(-45deg)',
      zIndex: 1000
    }
  }
)

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

export interface CheckboxTheme {
  boxSelectedColor: string
  boxDeselectedColor: string
  color: string
}
