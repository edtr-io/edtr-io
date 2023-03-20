import { styled, EdtrIcon, edtrPlus } from '@edtr-io/ui'
import * as React from 'react'

import { RowsPluginConfig } from '..'

const StyledSeparator = styled.div<{ isFirst?: boolean; isLast?: boolean }>(
  ({ isFirst, isLast }) => {
    return {
      position: 'absolute',
      height: 'auto',
      width: '100%',
      transform:
        isFirst && isLast
          ? undefined
          : isFirst
          ? 'translateY(-100%)'
          : isLast
          ? 'translateY(170%)'
          : 'translateY(100%)',
      top: isFirst ? 0 : undefined,
      bottom: isFirst ? undefined : 0,
    }
  }
)

const AddTrigger = styled.div<{
  focused: boolean
  visible: 'always' | 'on-focus'
  config: RowsPluginConfig
}>(({ focused, visible, config }) => {
  const { theme } = config
  return {
    maxWidth: '100%',
    height: '26px',
    borderRadius: '13px',
    display: 'flex',
    gap: '5px',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.color,
    backgroundColor: theme.backgroundColor,
    padding: '5px 0 10px',
    opacity: visible === 'always' ? 0.6 : focused ? 0.6 : 0,
    transition: '250ms all ease-in-out 250ms',
    // position: inline ? 'absolute' : 'relative',
    zIndex: 70,

    '&:hover': {
      color: theme.highlightColor,
      opacity: 1,
      cursor: 'pointer',
    },
  }
})

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

export function Add({
  config,
  focused,
  onClick,
  visuallyEmphasized = false,
}: {
  config: RowsPluginConfig
  focused: boolean
  onClick: () => void
  visuallyEmphasized?: boolean
}) {
  return (
    <AddTrigger
      className="add-trigger"
      config={config}
      focused={focused}
      visible={visuallyEmphasized ? 'always' : 'on-focus'}
      title={config.i18n.addLabel}
      onMouseDown={onClick}
    >
      <Icon icon={edtrPlus} />
      {visuallyEmphasized ? <span>{config.i18n.addLabel}</span> : null}
    </AddTrigger>
  )
}

export function Separator({
  config,
  isFirst,
  isLast,
  onClick,
  focused,
}: {
  config: RowsPluginConfig
  isFirst?: boolean
  isLast?: boolean
  onClick: () => void
  focused?: boolean
}) {
  return (
    <StyledSeparator isFirst={isFirst} isLast={isLast}>
      <TriggerArea>
        <Add
          config={config}
          focused={focused || false}
          onClick={onClick}
          visuallyEmphasized={isLast}
        />
      </TriggerArea>
    </StyledSeparator>
  )
}
