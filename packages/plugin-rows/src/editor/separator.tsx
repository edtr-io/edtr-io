import { styled, EdtrIcon, edtrRowsControls } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import * as React from 'react'

import { createRowPluginTheme } from '..'

const StyledSeparator = styled.div<{ isFirst?: boolean }>(({ isFirst }) => {
  return {
    position: 'absolute',
    height: 'auto',
    width: 'calc(100% - 60px)',
    transform: isFirst ? 'translateY(-100%)' : 'translateY(100%)',
    top: isFirst ? 0 : undefined,
    bottom: isFirst ? undefined : 0
  }
})

const AddTrigger = styled.div<{ focused: boolean; name: string }>(
  ({
    name,
    focused,
    ...props
  }: ThemeProps & { focused: boolean; name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
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
        cursor: 'pointer'
      }
    }
  }
)

const TriggerArea = styled.div({
  width: '100%',
  padding: '2px 0 4px',
  display: 'flex',
  justifyContent: 'center',

  '&:hover .add-trigger': {
    opacity: 0.6
  }
})

const Icon = styled(EdtrIcon)({
  width: '26px'
})

export const Add: React.FunctionComponent<{
  name: string
  focused: boolean
}> = props => {
  return (
    <AddTrigger
      className="add-trigger"
      name={props.name}
      focused={props.focused}
      title="Füge ein Element hinzu"
    >
      <Icon icon={edtrRowsControls.plus} />
    </AddTrigger>
  )
}

export const Separator: React.FunctionComponent<{
  isFirst?: boolean
  name: string
  onClick: () => void
  focused?: boolean
}> = ({ isFirst, onClick, name, focused }) => {
  return (
    <StyledSeparator isFirst={isFirst} onMouseDown={onClick}>
      <TriggerArea>
        <Add name={name} focused={focused || false} />
      </TriggerArea>
    </StyledSeparator>
  )
}
