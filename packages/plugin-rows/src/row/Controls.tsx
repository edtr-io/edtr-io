import React, { useState, useEffect } from 'react'
import { styled } from '@edtr-io/ui'
import { rowsState, rowState } from '..'
import { StateType } from '@edtr-io/core'

const StyledControls = styled.div<{ index: number }>(({ index }) => {
  return {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translateX(calc(100% + 3px))',
    backgroundColor: 'rgba(177, 4, 56, 1)',
    width: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '0 3px 3px 0',
    opacity: 0,
    zIndex: 100 - index,
    transition: '250ms all ease-in-out'
  }
})

const StyledIcon = styled.img<{ disabled?: boolean }>(({ disabled }) => {
  return {
    height: '20px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.2 : 0.8,
    '&:hover': {
      opacity: disabled ? 0.2 : 1
    }
  }
})

const MoveUp: Icon = ({ rows, index }) => (
  <StyledIcon
    disabled={index === 0}
    src={require('../../assets/angle-up-white.svg')}
    onClick={() => {
      if (index === 0) return
      rows.move(index, index - 1)
    }}
  />
)

const MoveDown: Icon = ({ rows, index }) => (
  <StyledIcon
    disabled={index + 1 >= rows.items.length}
    src={require('../../assets/angle-down-white.svg')}
    onClick={() => {
      index + 1 < rows.items.length && rows.move(index, index + 1)
    }}
  />
)

const More: Icon = ({ open, setOpen }) => {
  return (
    <StyledIcon
      src={require('../../assets/more-white.svg')}
      onClick={() => setOpen(!open)}
    />
  )
}

const Copy: Icon = ({ row, copyToClipboard }) => {
  return (
    <StyledIcon
      src={require('../../assets/copy-white.svg')}
      style={{ marginTop: 5, marginBottom: 5, marginRight: -1 }}
      onClick={() => copyToClipboard(row())}
    />
  )
}

const Cut: Icon = ({ rows, row, index, copyToClipboard }) => {
  return (
    <StyledIcon
      src={require('../../assets/cut-white.svg')}
      disabled={rows.items.length === 1}
      style={{ marginBottom: 5 }}
      onClick={() => {
        if (rows.items.length === 1) return
        copyToClipboard(row())
        rows.remove(index)
      }}
    />
  )
}

const Remove: Icon = ({ rows, index }) => {
  return (
    <StyledIcon
      disabled={rows.items.length === 1}
      src={require('../../assets/remove-white.svg')}
      style={{ marginBottom: 3 }}
      onClick={() => {
        if (rows.items.length === 1) return
        rows.remove(index)
      }}
    />
  )
}

type Icon = React.FunctionComponent<IconProps>
interface IconProps {
  key: number
  index: number
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  open: boolean
  setOpen: (newValue: boolean) => void
  copyToClipboard: (
    row: StateType.StateDescriptorValueType<typeof rowState>
  ) => void
  row: StateType.StateDescriptorReturnType<typeof rowState>
}
const icons: {
  icon: Icon
  onlyOpen?: boolean
  onlyClosed?: boolean
}[] = [
  { icon: MoveUp },
  { icon: MoveDown },
  { icon: More },
  { icon: Copy, onlyOpen: true },
  { icon: Cut, onlyOpen: true },
  { icon: Remove, onlyOpen: true }
]

export const Controls: React.FunctionComponent<{
  index: number
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  copyToClipboard: (id: string) => void
  row: StateType.StateDescriptorReturnType<typeof rowState>
  hover: boolean
}> = ({ index, rows, copyToClipboard, row, hover }) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!hover) setOpen(false)
  }, [hover])

  return (
    <StyledControls index={index} className="row-controls">
      {icons
        .filter(el => (!open ? !el.onlyOpen : true))
        .filter(el => (open ? !el.onlyClosed : true))
        .map((el, i) => (
          <el.icon
            key={i}
            index={index}
            rows={rows}
            open={open}
            setOpen={setOpen}
            copyToClipboard={copyToClipboard}
            row={row}
          />
        ))}
    </StyledControls>
  )
}
