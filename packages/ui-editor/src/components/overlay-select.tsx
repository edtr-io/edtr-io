import {
  createEditorUiTheme,
  EditorThemeProps,
  SelectTheme,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

import { createOverlayTheme } from './settings-overlay'

export const createOverlaySelectTheme = createEditorUiTheme<SelectTheme>(
  theme => {
    return {
      color: theme.backgroundColor,
      backgroundColor: 'transparent',
      highlightColor: theme.primary.background
    }
  }
)

const InputLabel = styled.label((props: EditorThemeProps) => {
  const theme = createOverlayTheme(props.theme)

  return {
    color: theme.select.color,
    margin: '20px auto 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const InputLabelInner = styled.span({ width: '20%' })

const SelectInner = styled.div({
  width: '75%',
  textAlign: 'left'
})

const Select = styled.select<{ selectBoxWidth?: string }>(props => {
  return {
    width: props.selectBoxWidth,
    borderRadius: '5px',
    outline: 'none'
  }
})

export class OverlaySelect extends React.Component<SelectProps> {
  private input = React.createRef<HTMLInputElement>()

  public focus() {
    const input = this.input.current
    if (input) {
      input.focus()
    }
  }

  public render() {
    const { label, options, ...props } = this.props
    return (
      <InputLabel>
        <InputLabelInner>{label}</InputLabelInner>
        <SelectInner>
          <Select
            selectBoxWidth={props.selectBoxWidth}
            onChange={props.onChange}
            value={props.value}
          >
            {options.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              )
            })}
          </Select>
        </SelectInner>
      </InputLabel>
    )
  }
}

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label?: string
  selectBoxWidth?: string
  options: string[]
}
