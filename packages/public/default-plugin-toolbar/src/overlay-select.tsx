import { OverlaySelectProps } from '@edtr-io/plugin-toolbar/beta'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { DefaultPluginToolbarConfig } from './config'

const OverlayInputLabel = styled.label({
  color: 'rgba(51,51,51,0.95)',
  margin: '20px auto 0px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})

const OverlayInputLabelInner = styled.span({ width: '20%' })

const OverlaySelectInner = styled.div({
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

export function createOverlaySelect(_config: DefaultPluginToolbarConfig) {
  return function OverlaySelect({
    label,
    options,
    ...props
  }: OverlaySelectProps) {
    return (
      <OverlayInputLabel>
        <OverlayInputLabelInner>{label}</OverlayInputLabelInner>
        <OverlaySelectInner>
          <Select
            selectBoxWidth={props.width}
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
        </OverlaySelectInner>
      </OverlayInputLabel>
    )
  }
}
