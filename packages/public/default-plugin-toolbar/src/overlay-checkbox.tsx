import { OverlayCheckboxProps } from '@edtr-io/plugin-toolbar/beta'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { DefaultPluginToolbarConfig } from './config'

const OverlayCheckboxLabel = styled.label({
  color: 'rgba(51,51,51,0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '20px'
})

const OverlayCheckboxToggleContainer = styled.div<{
  value?: boolean
}>(({ value }) => {
  return {
    cursor: 'pointer',
    border: '2px solid rgba(51,51,51,0.95)',
    borderRadius: '15%',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    verticalAlign: 'middle',
    backgroundColor: value ? 'rgba(51,51,51,0.95)' : '#ffffff'
  }
})

const OverlayCheckboxLabelInner = styled.span({ width: '20%' })

const OverlayCheckboxToggle = styled.div<{ value?: boolean }>(({ value }) => {
  return {
    opacity: value ? 1 : 0,
    content: '',
    position: 'absolute',
    fontWeight: 'bold',
    width: '20px',
    height: '10px',
    border: '3px solid #ffffff',
    borderTop: 'none',
    borderRight: 'none',
    borderRadius: '1px',

    transform: 'rotate(-45deg)',
    zIndex: 1000
  }
})

const OverlayCheckboxInner = styled.div({
  width: '75%',
  textAlign: 'left'
})

export function createOverlayCheckbox(_config: DefaultPluginToolbarConfig) {
  return function OverlayCheckbox({
    checked,
    onChange,
    label
  }: OverlayCheckboxProps) {
    return (
      <OverlayCheckboxLabel>
        <OverlayCheckboxLabelInner>{label}</OverlayCheckboxLabelInner>
        <OverlayCheckboxInner>
          <OverlayCheckboxToggleContainer
            onClick={() => {
              if (onChange) {
                onChange(!checked)
              }
            }}
            value={checked}
          >
            <OverlayCheckboxToggle value={checked} />
          </OverlayCheckboxToggleContainer>
        </OverlayCheckboxInner>
      </OverlayCheckboxLabel>
    )
  }
}
