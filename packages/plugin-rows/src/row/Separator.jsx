import React from 'react'
import styled, { css } from 'styled-components'
import { Icon, faPlus } from '@edtr-io/ui'

const StyledSeparator = styled.div`
  position: absolute;
  height: auto;
  width: 100%;

  ${props =>
    props.isFirst
      ? css`
          top: 0;
          transform: translateY(-100%);
        `
      : css`
          bottom: 0;
          transform: translateY(100%);
        `}
`

const TriggerArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  &:hover .add-trigger {
    opacity: 0.6;
  }
`

const AddTrigger = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  opacity: 0;
  transition: 250ms all ease-in-out;
  position: relative;
  z-index: 999;

  &:hover {
    opacity: 1 !important;
    cursor: pointer;
  }

  ${props =>
    props.inline &&
    css`
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0.6;
    `}
`

export const Add = ({ onClick, inline, ...props }) => {
  return (
    <AddTrigger
      inline={inline}
      className="add-trigger"
      onClick={onClick}
      {...props}
    >
      <Icon style={{ width: 14, height: 14 }} icon={faPlus} />
    </AddTrigger>
  )
}

const Separator = ({ isFirst, onClick }) => {
  return (
    <StyledSeparator isFirst={isFirst}>
      <TriggerArea>
        <Add onClick={onClick} />
      </TriggerArea>
    </StyledSeparator>
  )
}

export default Separator
