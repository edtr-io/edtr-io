import * as React from 'react'
import { styled, EdtrIcon, edtrRowsControls } from '@edtr-io/editor-ui'
import { ThemeProps } from '@edtr-io/ui'
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.color,
      backgroundColor: theme.backgroundColor,
      opacity: inline ? 0.6 : 0,
      transition: '250ms all ease-in-out 250ms',
      position: inline ? 'absolute' : 'relative',
      zIndex: 70, //TODO: check this
      right: inline ? '15px' : undefined,
      top: inline ? '50%' : undefined,
      transform: inline ? 'translateY(-50%)' : undefined,

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
      <Icon icon={edtrRowsControls.plus} />
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
