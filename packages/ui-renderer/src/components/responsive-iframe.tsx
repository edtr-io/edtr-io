import * as React from 'react'

import { styled } from '../theme'

const Iframe = styled.div({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  border: 'none'
})

const IframeWrapper = styled.div<IframeWrapperProps>(
  ({ aspectRatio, disableCursorEvents }) => {
    return {
      position: 'relative',
      padding: '0',
      paddingTop: `${100 / aspectRatio}%`,
      display: 'block',
      height: '0',
      overflow: 'hidden',
      pointerEvents: disableCursorEvents ? 'none' : 'auto'
    }
  }
)

interface IframeWrapperProps {
  aspectRatio: number // e.g. 4:3
  disableCursorEvents?: boolean
}

// TODO:
// Use case 1: Fixed aspect ratio
// Use case 2: Iframe content tells parent to update its aspect ratio
// Use case: Video
export function ResponsiveIframe({
  initialAspectRatio,
  disableCursorEvents,
  children
}: ResponsiveIframeProps) {
  const [aspectRatio, setAspectRatio] = React.useState(initialAspectRatio)

  return (
    <IframeWrapper
      aspectRatio={aspectRatio}
      disableCursorEvents={disableCursorEvents}
    >
      <Iframe>{children(setAspectRatio)}</Iframe>
    </IframeWrapper>
  )
}

export interface ResponsiveIframeProps {
  initialAspectRatio: number // e.g. 4:3
  disableCursorEvents?: boolean
  children: (setAspectRatio: (aspectRatio: number) => void) => React.ReactNode
}
