import { PluginToolbarButtonProps } from '@edtr-io/plugin-toolbar'
import * as React from 'react'

import { Button } from './button'
import { DefaultPluginToolbarConfig } from './config'
import { StyledIconContainer } from './icon-container'

export function createPluginToolbarButton(_config: DefaultPluginToolbarConfig) {
  const PluginToolbarButton = React.forwardRef<
    HTMLButtonElement,
    PluginToolbarButtonProps
  >(function PluginToolbarButton(props, ref) {
    return (
      <div>
        <Button
          className={props.className}
          title={props.label}
          ref={ref}
          onClick={props.onClick}
        >
          <StyledIconContainer>{props.icon}</StyledIconContainer>
        </Button>
      </div>
    )
  })
  return PluginToolbarButton
}
