/**
 * @module @edtr-io/editor-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  createEditorUiTheme,
  CheckboxTheme,
  EditorThemeProps,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

/** @public */
export const createEditorCheckboxTheme = createEditorUiTheme<CheckboxTheme>(
  theme => {
    return {
      boxSelectedColor: theme.backgroundColor,
      boxDeselectedColor: 'transparent',
      color: theme.backgroundColor
    }
  }
)

const CheckboxLabel = styled.label((props: EditorThemeProps) => {
  const theme = createEditorCheckboxTheme('checkbox', props.theme)

  return {
    color: theme.color
  }
})

const CheckboxToggleContainer = styled.div((props: EditorThemeProps) => {
  const theme = createEditorCheckboxTheme('checkbox', props.theme)

  return {
    cursor: 'pointer',
    margin: '0 5px -1px 5px',
    border: `2px solid ${theme.color}`,
    borderRadius: '15%',
    width: '15px',
    height: '15px',
    display: 'inline-block',
    backgroundColor: theme.boxDeselectedColor
  }
})

const CheckboxLabelInner = styled.span({ width: '5%' })

const CheckboxToggle = styled.div<{ value?: boolean }>(
  ({ value, ...props }: { value?: boolean } & EditorThemeProps) => {
    const theme = createEditorCheckboxTheme('checkbox', props.theme)

    return {
      opacity: value ? 1 : 0,
      content: '',
      position: 'absolute',
      fontWeight: 'bold',
      margin: '3px 0 0 2px',
      width: '10px',
      height: '5px',
      border: `2px solid ${theme.boxSelectedColor}`,
      borderTop: 'none',
      borderRight: 'none',

      transform: 'rotate(-45deg)',
      zIndex: 1000
    }
  }
)

/** @public */
export class EditorCheckbox extends React.Component<EditorCheckboxProps> {
  public render() {
    const { checked, onChange, label } = this.props
    return (
      <CheckboxLabel>
        <CheckboxLabelInner>{label}</CheckboxLabelInner>

        <CheckboxToggleContainer
          onClick={() => {
            if (onChange) {
              onChange(!checked)
            }
          }}
        >
          <CheckboxToggle value={checked} />
        </CheckboxToggleContainer>
      </CheckboxLabel>
    )
  }
}

/** @public */
export interface EditorCheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}
