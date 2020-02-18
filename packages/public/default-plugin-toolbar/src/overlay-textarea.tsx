import { OverlayTextareaProps } from '@edtr-io/plugin-toolbar/beta'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { DefaultPluginToolbarConfig } from './config'

const OverlayTextareaLabel = styled.label({
  color: 'rgba(51,51,51,0.95)',
  display: 'flex',
  flexDirection: 'row',
  margin: '20px auto 0',
  justifyContent: 'space-between'
})

const OverlayTextareaLabelInner = styled.span({ width: '20%' })

const OverlayTextareaInner = styled.textarea<{
  config: DefaultPluginToolbarConfig
}>(({ config }) => {
  return {
    backgroundColor: '#ffffff',
    border: '2px solid rgba(51,51,51,0.95)',
    marginTop: '5px',
    borderRadius: '5px',
    color: '2px solid rgba(51,51,51,0.95)',
    padding: '10px',
    resize: 'none',
    outline: 'none',
    minHeight: '100px',
    width: '75%',
    '&:focus': {
      border: `2px solid ${config.primaryColor}`
    }
  }
})

export function createOverlayTextarea(config: DefaultPluginToolbarConfig) {
  return function OverlayTextarea({ label, ...props }: OverlayTextareaProps) {
    return (
      <OverlayTextareaLabel>
        <OverlayTextareaLabelInner>{label}</OverlayTextareaLabelInner>
        <OverlayTextareaInner {...props} ref={undefined} config={config} />
      </OverlayTextareaLabel>
    )
  }
}
