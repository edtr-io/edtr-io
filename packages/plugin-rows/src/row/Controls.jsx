import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'

const StyledControls = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(calc(100% + 3px));
  background-color: rgba(177, 4, 56, 1);
  width: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 3px 3px 0;
  opacity: 0;
  z-index: ${props => 100 - props.index};
  transition: 250ms all ease-in-out;
`

const StyledIcon = styled.img`
  height: 20px;

  ${props =>
    props.disabled
      ? css`
          opacity: 0.2;
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
          opacity: 0.8;
        `}

  &:hover {
    opacity: ${props => !props.disabled && 1};
  }
`

const MoveUp = ({ rows, index, row, ...props }) => (
  <StyledIcon
    disabled={index === 0}
    src={require('../assets/angle-up-white.svg')}
    onClick={() => {
      if (index === 0) return
      rows.move(index, index - 1)
    }}
  />
)

const MoveDown = ({ rows, index, row, ...props }) => (
  <StyledIcon
    disabled={index + 1 >= rows.items.length}
    src={require('../assets/angle-down-white.svg')}
    onClick={() => {
      index + 1 < rows.items.length && rows.move(index, index + 1)
    }}
  />
)

const More = ({ open, setOpen, ...props }) => {
  return (
    <StyledIcon
      src={require('../assets/more-white.svg')}
      onClick={() => setOpen(!open)}
    />
  )
}

const Copy = ({ row, copyToClipboard, ...props }) => {
  return (
    <StyledIcon
      src={require('../assets/copy-white.svg')}
      style={{ marginTop: 5, marginBottom: 5, marginRight: -1 }}
      onClick={() => copyToClipboard(row())}
    />
  )
}

const Cut = ({ rows, row, index, copyToClipboard, ...props }) => {
  return (
    <StyledIcon
      src={require('../assets/cut-white.svg')}
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

const Remove = ({ rows, index, ...props }) => {
  return (
    <StyledIcon
      disabled={rows.items.length === 1}
      src={require('../assets/remove-white.svg')}
      style={{ marginBottom: 3 }}
      onClick={() => {
        if (rows.items.length === 1) return
        rows.remove(index)
      }}
    />
  )
}

const icons = [
  { icon: MoveUp },
  { icon: MoveDown },
  { icon: More },
  { icon: Copy, onlyOpen: true },
  { icon: Cut, onlyOpen: true },
  { icon: Remove, onlyOpen: true }
]

const Controls = ({ index, rows, copyToClipboard, row, hover }) => {
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

export default Controls
