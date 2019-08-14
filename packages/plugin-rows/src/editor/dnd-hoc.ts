import { DocumentState, Plugin } from '@edtr-io/core'
import * as React from 'react'
import {
  ConnectDragPreview,
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DropTarget,
  DropTargetMonitor
} from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { RowSourceProps, RowStateProps, RowMenuProps } from './row'

export interface CollectedProps {
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview
  isDragging: boolean
}

export interface TargetProps {
  connectDropTarget: ConnectDropTarget
}

export function connectDnD(
  Comp: React.ComponentType<RowSourceProps & RowStateProps & RowMenuProps>
) {
  return DropTarget<
    {
      index: number
      moveRow: (from: number, to: number) => void
      insert: (index: number, data: DocumentState) => void
      plugins: Record<string, Plugin>
    },
    TargetProps
  >(
    ['row', NativeTypes.FILE, NativeTypes.URL],
    {
      hover(props, monitor, component) {
        if (!component) {
          return null
        }
        const node = component.getNode()
        if (!node) {
          return null
        }
        // set the boundingRect for later use (see isDraggingAbove)
        monitor.getItem().boundingRect = node.getBoundingClientRect()

        if (monitor.getItemType() === 'row') {
          const dragIndex = monitor.getItem().index
          const hoverIndex = props.index
          if (dragIndex === hoverIndex) {
            return
          }

          const draggingAbove = isDraggingAbove(monitor)
          if (dragIndex < hoverIndex && draggingAbove) {
            return
          }
          if (dragIndex > hoverIndex && !draggingAbove) {
            return
          }

          props.moveRow(dragIndex, hoverIndex)
          monitor.getItem().index = hoverIndex
        }
      },
      drop(props, monitor) {
        const type = monitor.getItemType()
        if (type !== NativeTypes.FILE && type !== NativeTypes.URL) {
          return
        }

        if (monitor.didDrop()) {
          // handled in nested dropzone
          return
        }
        const dropIndex = props.index

        let transfer: DataTransfer
        if (type === NativeTypes.FILE) {
          const files: File[] = monitor.getItem().files
          transfer = createFakeDataTransfer(files)
        } else {
          // NativeTypes.URL
          const urls: string[] = monitor.getItem().urls
          transfer = createFakeDataTransfer([], urls[0])
        }

        for (let key in props.plugins) {
          const { onPaste } = props.plugins[key]
          if (typeof onPaste === 'function') {
            const result = onPaste(transfer)
            if (result !== undefined) {
              if (isDraggingAbove(monitor)) {
                props.insert(dropIndex, { plugin: key, state: result.state })
              } else {
                props.insert(dropIndex + 1, {
                  plugin: key,
                  state: result.state
                })
              }
              return
            }
          }
        }
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
function isDraggingAbove(monitor: DropTargetMonitor) {
  // get bounding Rect set in hover
  const domBoundingRect = monitor.getItem().boundingRect

  const domMiddleY = (domBoundingRect.bottom - domBoundingRect.top) / 2
  const dropClientOffset = monitor.getClientOffset()
  const dragClientY = dropClientOffset
    ? dropClientOffset.y - domBoundingRect.top
    : 0

  return dragClientY < domMiddleY
}

// Needed until we get the correct dataTransfer (see e.g. https://github.com/react-dnd/react-dnd/issues/635)
function createFakeDataTransfer(files: File[], text?: string) {
  class FakeDataTransfer extends DataTransfer {
    public dropEffect = 'all'
    public effectAllowed = 'all'
    public readonly files = (files as unknown) as FileList
    public readonly types = ['Files']
    public getData(type: string) {
      if (type.toLowerCase().startsWith('text')) {
        return text || ''
      }
      return ''
    }
  }
  return new FakeDataTransfer()
}
