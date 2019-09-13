import { EdtrIcon, edtrRowsControls, styled } from '@edtr-io/editor-ui'
import { StateTypeReturnType } from '@edtr-io/plugin'
import * as React from 'react'

import { MoveControlsProps } from '.'
import { createRowPluginTheme, rowsState, rowState } from '../..'

const StyledControls = styled.div({
  display: 'flex'
})

const IconContainer = styled.div<{ disabled?: boolean; name: string }>(
  ({ disabled, name, ...props }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      height: '24px',
      marginBottom: '15px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: disabled ? theme.menu.secondary.color : theme.menu.primary.color,
      pointerEvents: disabled ? 'none' : undefined,
      '&:hover': {
        color: disabled ? theme.menu.secondary.color : theme.menu.highlightColor
      }
    }
  }
)

const DragIcon = styled(IconContainer)({
  marginBottom: '5px',
  marginTop: '-3px',
  cursor: 'grab',
  userSelect: 'none',
  '&:active': {
    cursor: 'grabbing'
  }
})

const Drag: React.FunctionComponent<
  IconProps & { connectDragSource: Function }
> = ({ rows, connectDragSource, name }) => {
  return connectDragSource(
    <div>
      <DragIcon
        title="Verschiebe das Element innerhalb des Dokuments"
        name={name}
        draggable={false}
        disabled={rows.length === 1}
      >
        <EdtrIcon icon={edtrRowsControls.dragHandle} />
      </DragIcon>
    </div>
  )
}

interface IconProps {
  name: string
  index: number
  rows: StateTypeReturnType<typeof rowsState>
  row: StateTypeReturnType<typeof rowState>
}

export const MoveControls = ({
  index,
  rows,
  row,
  name,
  connectDragSource
}: MoveControlsProps) => {
  return (
    <StyledControls>
      <Drag
        rows={rows}
        index={index}
        row={row}
        connectDragSource={connectDragSource}
        name={name}
      />
    </StyledControls>
  )
}
