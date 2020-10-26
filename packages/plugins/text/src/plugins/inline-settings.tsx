import { HoverOverlay, HoverOverlayProps } from '@edtr-io/editor-ui'
import { faTrashAlt, Icon, styled } from '@edtr-io/ui'
import * as React from 'react'

const InlinePreview = styled.span({
  padding: '0px 8px',
})
const ChangeButton = styled.div({
  padding: '5px 5px 5px 10px',
  display: 'inline-block',
  borderLeft: '2px solid rgba(51,51,51,0.95)',
  cursor: 'pointer',
  margin: '2px',
  '&:hover': {
    color: 'rgb(70, 155, 255)',
  },
})

export function InlineSettings({
  position = 'below',
  ...props
}: {
  children: React.ReactNode
  onDelete: React.MouseEventHandler
  position: HoverOverlayProps['position']
  anchor?: React.RefObject<HTMLElement>
}) {
  return (
    <HoverOverlay position={position} anchor={props.anchor}>
      <InlinePreview>{props.children}</InlinePreview>
      <ChangeButton onClick={props.onDelete}>
        <Icon icon={faTrashAlt} />
      </ChangeButton>
    </HoverOverlay>
  )
}
