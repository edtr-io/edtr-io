import { StateType } from '@edtr-io/core'
import { styled, Icon, faCopy, faTrashAlt } from '@edtr-io/editor-ui'
import * as React from 'react'

import { createRowPluginTheme, rowsState } from '../..'

const StyledGlobals = styled.div({
  display: 'flex',
  alignItems: 'center'
})

const IconContainer = styled.div<{ disabled?: boolean; name: string }>(
  ({ disabled, name, ...props }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      height: '24px',
      margin: 0,
      marginLeft: '5px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? theme.menu.secondary.color : theme.menu.primary.color,
      '&:hover': {
        color: disabled ? theme.menu.secondary.color : theme.highlightColor
      }
    }
  }
)

const Copy = ({ duplicateRow, close, name }: GlobalsProps) => {
  return (
    <IconContainer
      name={name}
      onClick={() => {
        duplicateRow()
        close()
      }}
    >
      <Icon icon={faCopy} />
    </IconContainer>
  )
}

const Remove = ({ rows, index, close, name }: GlobalsProps) => {
  return (
    <IconContainer
      name={name}
      disabled={rows.items.length === 1}
      onClick={() => {
        if (rows.items.length === 1) return
        rows.remove(index)
        close()
      }}
    >
      <Icon icon={faTrashAlt} />
    </IconContainer>
  )
}

interface GlobalsProps {
  name: string
  index: number
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  close: () => void
  duplicateRow: () => void
}
export const Globals = (props: GlobalsProps) => {
  return (
    <StyledGlobals>
      <Copy {...props} />
      <Remove {...props} />
    </StyledGlobals>
  )
}
