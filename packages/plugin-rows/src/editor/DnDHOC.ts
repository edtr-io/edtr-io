import * as React from 'react'
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DropTarget
} from 'react-dnd'
import { RowSourceProps } from './row'

export interface CollectedProps {
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview
  isDragging: boolean
}

export interface TargetProps {
  connectDropTarget: ConnectDropTarget
}

export function connectDnD(Comp: React.ComponentType<RowSourceProps>) {
  return DropTarget<
    { index: number; moveRow: (from: number, to: number) => void },
    TargetProps
  >(
    'row',
    {
      hover(props, monitor, component) {
        if (!component) {
          return null
        }
        const node = component.getNode()
        if (!node) {
          return null
        }
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index
        if (dragIndex === hoverIndex) {
          return
        }
        const hoverBoundingRect = node.getBoundingClientRect()
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        const clientOffset = monitor.getClientOffset()
        const hoverClientY = clientOffset
          ? clientOffset.y - hoverBoundingRect.top
          : 0

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }

        props.moveRow(dragIndex, hoverIndex)
        monitor.getItem().index = hoverIndex
      }
    },
    connect => ({
      connectDropTarget: connect.dropTarget()
    })
  )(
    DragSource<
      { id: number; index: number },
      CollectedProps,
      { id: number; index: number }
    >(
      'row',
      {
        beginDrag: props => ({
          id: props.id,
          index: props.index
        })
      },
      (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
      })
    )(Comp)
  )
}
