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

import { createOverlayTheme } from './settings-overlay'

export const createOverlayCheckboxTheme = createEditorUiTheme<CheckboxTheme>(
  theme => {
    return {
      boxSelectedColor: theme.color,
      boxDeselectedColor: theme.backgroundColor,
      color: theme.color
    }
  }
)

const CheckboxLabel = styled.label((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    color: theme.checkbox.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '20px'
  }
})

const CheckboxInlineLabel = styled.label((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)
  return {
    color: theme.checkbox.color,
    verticalAlign: 'middle',
    margin: '5px 10px',
    display: 'inline-block'
  }
})

const CheckboxInlineLabelInner = styled.span({
  marginRight: '10px',
  verticalAlign: 'middle'
})

const CheckboxToggleContainer = styled.div<{
  value?: boolean
}>(({ value, ...props }: { value?: boolean } & EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    cursor: 'pointer',
    border: `2px solid ${theme.checkbox.color}`,
    borderRadius: '15%',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    verticalAlign: 'middle',
    backgroundColor: value
      ? theme.checkbox.boxSelectedColor
      : theme.checkbox.boxDeselectedColor
  }
})

const CheckboxLabelInner = styled.span({ width: '20%' })

const CheckboxToggle = styled.div<{ value?: boolean }>(
  ({ value, ...props }: { value?: boolean } & EditorThemeProps) => {
    const theme = createOverlayTheme(props.theme)

    return {
      opacity: value ? 1 : 0,
      content: '',
      position: 'absolute',
      fontWeight: 'bold',
      width: '20px',
      height: '10px',
      border: `3px solid ${theme.checkbox.boxDeselectedColor}`,
      borderTop: 'none',
      borderRight: 'none',
      borderRadius: '1px',

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

export const InlineCheckbox: React.FunctionComponent<CheckboxProps> = ({
  checked,
  onChange,
  label
}) => {
  return (
    <CheckboxInlineLabel>
      <CheckboxInlineLabelInner>{label}</CheckboxInlineLabelInner>
      <CheckboxToggleContainer
        onMouseDown={e => {
          // avoid loosing focus
          e.stopPropagation()
        }}
        onClick={() => {
          if (onChange) {
            onChange(!checked)
          }
        }}
        value={checked}
      >
        <CheckboxToggle value={checked} />
      </CheckboxToggleContainer>
    </CheckboxInlineLabel>
  )
}

export interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}
