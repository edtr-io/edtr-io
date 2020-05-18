import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { Resizable as ReactResizeable } from 'react-resizable'

const StyledResizable = styled(ReactResizeable)<{
  floating?: 'left' | 'right'
}>((props) => {
  return {
    '.react-resizable-handle': {
      [props.floating === 'right' ? 'left' : 'right']: '-4px',
      position: 'absolute',
      zIndex: 5,
      width: '4px',
      top: '0',
      bottom: '0',
      right: '-2px',
      cursor: 'e-resize',
      backgroundColor: 'transparent',
      transition: 'all 200ms linear',
      '&:after': {
        content: '" "',
        backgroundColor: 'rgba(0, 0, 0, 0.54)',
        position: 'absolute',
        top: 'calc(50% - 20px)',
        bottom: 'calc(50% - 20px)',
        left: '0',
        right: '0',
        transition: 'all 200ms linear',
      },
      '&:hover:after, &:active:after': {
        backgroundColor: '#000',
        top: '0',
        bottom: '0',
        cursor: 'e-resize',
      },
    },
  }
})

const Floating = styled.div<{
  responsiveBreakpoint?: number
  floating?: 'left' | 'right'
  widthInPercent: number
}>((props) => {
  return {
    width: `${props.widthInPercent}%`,
    float: props.floating,
    zIndex: 10,
    ...(props.responsiveBreakpoint
      ? {
          [`@media (max-width: ${props.responsiveBreakpoint}px)`]: {
            width: '100%',
            float: 'none',

            '.react-resizable-handle, &:after': {
              display: 'none',
            },
          },
        }
      : {}),
  }
})

/**
 * @param props - Props
 * @public
 */
export function Resizable(props: React.PropsWithChildren<ResizableProps>) {
  const stepWidth = Math.round(props.rowWidth / props.steps)
  const [widthInPercent, setWidthInPercent] = React.useState(
    (props.widthInSteps * 100) / props.steps
  )
  const [width, setWidth] = React.useState(props.widthInSteps * stepWidth)

  React.useEffect(() => {
    setWidthInPercent((props.widthInSteps * 100) / props.steps)
    setWidth(props.widthInSteps * stepWidth)
  }, [props.widthInSteps, props.steps, stepWidth])

  function onResize(
    event: React.SyntheticEvent,
    { size }: { size: { width: number } }
  ) {
    const newSize = widthToSize(size.width)

    const { onChange = () => {} } = props
    onChange(newSize)
    setWidth(size.width)
    setWidthInPercent((newSize * 100) / props.steps)
  }

  function onResizeEnd(
    event: React.SyntheticEvent,
    { size }: { size: { width: number } }
  ) {
    const newSize = widthToSize(size.width)

    const { onResizeEnd = () => {} } = props
    onResizeEnd(newSize)
  }

  return (
    <Floating
      className={props.className}
      responsiveBreakpoint={props.responsiveBreakpoint}
      floating={props.floating}
      widthInPercent={widthInPercent}
    >
      {props.enabled ? (
        <StyledResizable
          onResize={onResize}
          onResizeStop={onResizeEnd}
          draggableOpts={{
            axis: 'none',
            offsetParent: document.body,
          }}
          width={width}
          height={0}
          floating={props.floating}
        >
          {/* this div needs to be kept or resize will be broken */}
          <div>{props.children}</div>
        </StyledResizable>
      ) : (
        <div>{props.children}</div>
      )}
    </Floating>
  )

  function widthToSize(width: number): number {
    let size = Math.round(width / stepWidth)
    const maxSize = props.floating ? props.steps - 1 : props.steps

    if (props.floating === 'right') {
      size = maxSize - size
    }
    if (size > maxSize) {
      size = maxSize
    } else if (size < 1) {
      size = 1
    }

    return size
  }
}

/** @public */
export interface ResizableProps {
  className?: string
  rowWidth: number
  onChange?: (width: number) => void
  onResizeEnd?: (width: number) => void
  floating?: 'left' | 'right'
  steps: number
  widthInSteps: number
  responsiveBreakpoint?: number
  enabled: boolean
}
