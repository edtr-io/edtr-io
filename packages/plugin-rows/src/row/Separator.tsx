import React from 'react'
import { Icon, faPlus, styled } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
import { createRowPluginTheme } from '..'

const StyledSeparator = styled.div<{ isFirst?: boolean }>(({ isFirst }) => {
  return {
    position: 'absolute',
    height: 'auto',
    width: '100%',
    transform: isFirst ? 'translateY(-100%)' : 'translateY(100%)',
    top: isFirst ? 0 : undefined,
    bottom: isFirst ? undefined : 0
  }
})

const AddTrigger = styled.div<{ inline: boolean; name: string }>(
  ({
    inline,
    name,
    ...props
  }: ThemeProps & { inline: boolean; name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      width: '26px',
      height: '26px',
      borderRadius: '13px',
      border: `2px solid ${theme.backgroundColor}`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.backgroundColor,
      backgroundColor: theme.lightBackgroundColor,
      opacity: inline ? 0.6 : 0,
      transition: '250ms all ease-in-out',
      position: inline ? 'absolute' : 'relative',
      zIndex: 70,
      right: inline ? '15px' : undefined,
      top: inline ? '10%' : undefined,
      transform: inline ? 'translate(-50%)' : undefined,

      '&:hover': {
        color: theme.highlightColor,
        borderColor: theme.highlightColor,
        opacity: 1,
        cursor: 'pointer'
      }
    }
  }
)

const TriggerArea = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',

  '&:hover .add-trigger': {
    opacity: 0.6
  }
})

export const Add: React.FunctionComponent<{
  onClick: () => void
  name: string
  inline?: boolean
}> = props => {
  return (
    <AddTrigger
      inline={props.inline || false}
      className="add-trigger"
      onClick={props.onClick}
      name={props.name}
    >
      <Icon style={{ width: 14, height: 14 }} icon={faPlus} />
    </AddTrigger>
  )
}

export const Separator: React.FunctionComponent<{
  isFirst?: boolean
  name: string
  onClick: () => void
}> = ({ isFirst, onClick, name }) => {
  return (
    <StyledSeparator isFirst={isFirst}>
      <TriggerArea>
        <Add name={name} onClick={onClick} />
      </TriggerArea>
    </StyledSeparator>
  )
}
