import { styled } from '@edtr-io/ui'
import * as React from 'react'

const CheckboxInlineLabel = styled.label({
  color: '#ffffff',
  verticalAlign: 'middle',
  margin: '5px 10px',
  display: 'inline-block',
})

const CheckboxInlineLabelInner = styled.span({
  marginRight: '10px',
  verticalAlign: 'middle',
})

const CheckboxToggleContainer = styled.div<{
  value?: boolean
}>(({ value }) => {
  return {
    cursor: 'pointer',
    border: '2px solid #ffffff',
    borderRadius: '15%',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    verticalAlign: 'middle',
    backgroundColor: value ? '#ffffff' : 'rgba(51,51,51,0.95)',
  }
})

const CheckboxToggle = styled.div<{ value?: boolean }>(({ value }) => {
  return {
    opacity: value ? 1 : 0,
    content: '',
    position: 'absolute',
    fontWeight: 'bold',
    width: '20px',
    height: '10px',
    border: '3px solid rgba(51,51,51,0.95)',
    borderTop: 'none',
    borderRight: 'none',
    borderRadius: '1px',

    transform: 'rotate(-45deg)',
    zIndex: 1000,
  }
})

export function InlineCheckbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <CheckboxInlineLabel>
      <CheckboxInlineLabelInner>{label}</CheckboxInlineLabelInner>
      <CheckboxToggleContainer
        onMouseDown={(e) => {
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
