import { OverlayButtonProps } from '@edtr-io/plugin-toolbar/beta'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { DefaultPluginToolbarConfig } from './config'

const Button = styled.button<{ config: DefaultPluginToolbarConfig }>(
  ({ config }) => {
    return {
      margin: '3px',
      backgroundColor: '#ffffff',
      outline: 'none',
      border: '2px solid rgba(51,51,51,0.95)',
      color: 'rgba(51,51,51,0.95)',
      padding: '10px',
      borderRadius: '4px',
      minWidth: '125px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'rgb(70, 155, 255)',
        borderColor: config.primaryColor
      }
    }
  }
)

export function createOverlayButton(config: DefaultPluginToolbarConfig) {
  return function OverlayButton({
    children,
    label,
    ...props
  }: OverlayButtonProps) {
    return (
      <Button {...props} title={label} config={config}>
        {children || label}
      </Button>
    )
  }
}
