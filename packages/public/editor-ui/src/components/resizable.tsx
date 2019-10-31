/*
 * This file is part of ORY Editor.
 *
 * ORY Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ORY Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with ORY Editor.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license LGPL-3.0
 * @copyright 2016-2018 Aeneas Rekkas
 * @author Aeneas Rekkas <aeneas+oss@aeneas.io>
 *
 */

import * as React from 'react'
import { Resizable as ReactResizeable } from 'react-resizable'
import { styled } from '@edtr-io/ui'

const StyledResizable = styled(ReactResizeable)`
  .react-resizable-handle {
    left: -4px;
    position: absolute;
    z-index: 5;
    width: 4px;
    top: 0;
    bottom: 0;
    right: -2px;
    cursor: e-resize;
    background-color: transparent;
    transition: all 200ms linear;
    &:after {
      content: ' ';
      background-color: rgba(0, 0, 0, 0.54);
      /* width: 30px; */
      /* height: 30px; */
      position: absolute;
      /* z-index: 1000; */
      top: calc(50% - 20px);
      bottom: calc(50% - 20px);
      left: 0;
      right: 0;
      transition: all 200ms linear;
    }
    &:hover:after,
    &:active:after {
      background-color: #000;
      top: 0;
      bottom: 0;
      cursor: e-resize;
    }
  }
`
export function Resizable(props: React.PropsWithChildren<ResizableProps>) {
  const stepWidth = Math.round(props.rowWidth / props.steps)
  const [width, setWidth] = React.useState(props.widthInSteps * stepWidth)

  function onResize(
    event: React.SyntheticEvent,
    { size }: { size: { width: number } }
  ) {
    const newSize = widthToSize(size.width)

    props.onChange(newSize)
    setWidth(size.width)
  }

  function onResizeEnd(
    event: React.SyntheticEvent,
    { size }: { size: { width: number } }
  ) {
    const newSize = widthToSize(size.width)
    props.onResizeEnd(newSize)
  }

  return (
    <StyledResizable
      onResize={onResize}
      onResizeStop={onResizeEnd}
      draggableOpts={{ axis: 'none', offsetParent: document.body }}
      width={width}
      height={0}
    >
      {/* this div needs to be kept or resize will be broken */}
      <div>{props.children}</div>
    </StyledResizable>
  )

  function widthToSize(width: number): number {
    let size = Math.round(width / stepWidth)

    if (props.floating === 'right') {
      size = props.steps - 1 - size
    }
    if (size > props.steps - 1) {
      size = props.steps - 1
    } else if (size < 1) {
      size = 1
    }

    return size
  }
}

export interface ResizableProps {
  rowWidth: number
  onChange: (width: number) => void
  onResizeEnd: (width: number) => void
  floating: string
  steps: number
  widthInSteps: number
}
