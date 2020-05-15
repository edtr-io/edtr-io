import { styled, EdtrIcon, edtrPlus } from '@edtr-io/ui'
import * as React from 'react'

import { RowsPluginConfig } from '..'

const StyledSeparator = styled.div<{ isFirst?: boolean }>(({ isFirst }) => {
  return {
    position: 'absolute',
    height: 'auto',
    width: '100%',
    transform: isFirst ? 'translateY(-100%)' : 'translateY(100%)',
    top: isFirst ? 0 : undefined,
    bottom: isFirst ? undefined : 0,
  }
})

const AddTrigger = styled.div<{ focused: boolean; config: RowsPluginConfig }>(
  ({ focused, config }) => {
    const { theme } = config
    return {
      width: '26px',
      height: '26px',
      borderRadius: '13px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.color,
      backgroundColor: theme.backgroundColor,
      padding: '5px 0 10px',
      opacity: focused ? 0.6 : 0,
      transition: '250ms all ease-in-out 250ms',
      // position: inline ? 'absolute' : 'relative',
      zIndex: 70,

      '&:hover': {
        color: theme.highlightColor,
        opacity: 1,
        cursor: 'pointer',
      },
    }
  }
)

const TriggerArea = styled.div({
  width: '100%',
  padding: '2px 0 4px',
  display: 'flex',
  justifyContent: 'center',

  '&:hover .add-trigger': {
    opacity: 0.6,
  },
})

const Icon = styled(EdtrIcon)({
  width: '26px',
})

export function Add(props: {
  config: RowsPluginConfig
  focused: boolean
  onClick: () => void
}) {
  return (
    <AddTrigger
      className="add-trigger"
      config={props.config}
      focused={props.focused}
      title={props.config.i18n.addLabel}
      onMouseDown={props.onClick}
    >
      <Icon icon={edtrPlus} />
    </AddTrigger>
  )
}

export function Separator({
  config,
  isFirst,
  onClick,
  focused,
}: {
  config: RowsPluginConfig
  isFirst?: boolean
  onClick: () => void
  focused?: boolean
}) {
  return (
    <StyledSeparator isFirst={isFirst}>
      <TriggerArea>
        <Add config={config} focused={focused || false} onClick={onClick} />
      </TriggerArea>
    </StyledSeparator>
  )
}
