import {
  OverlayButton,
  PluginToolbarButton,
  SubDocument,
  useScopedDispatch,
  useScopedStore
} from '@edtr-io/core'
import { StateTypeReturnType } from '@edtr-io/plugin'
import {
  change,
  DocumentState,
  findNextNode,
  findPreviousNode,
  getDocument,
  getFocusTree,
  getPlugins,
  ReturnTypeFromSelector,
  serializeDocument
} from '@edtr-io/store'
import {
  edtrDragHandle,
  EdtrIcon,
  styled,
  Icon,
  faCopy,
  faTrashAlt
} from '@edtr-io/ui'
import * as React from 'react'
import {
  DragObjectWithType,
  DropTargetMonitor,
  useDrag,
  useDrop
} from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { RowsState } from '..'

interface RowDragObject extends DragObjectWithType {
  type: 'row'
  id: string
  serialized: DocumentState
}

const DragToolbarButton = styled(PluginToolbarButton)({
  marginBottom: '5px',
  marginTop: '-3px',
  cursor: 'grab',
  userSelect: 'none',
  '&:active': {
    cursor: 'grabbing'
  }
})

const ButtonContainer = styled.div({
  display: 'flex'
})

const Left = styled.div({
  flex: 1
})

const BorderlessOverlayButton = styled(OverlayButton)({
  border: 'none !important',
  padding: '0 !important',
  minWidth: '0 !important'
})

const GrayOut = styled.div({
  opacity: 0.3
})

export function RowRenderer({
  insert,
  row,
  rows,
  index,
  plugins
}: {
  insert(index: number, options?: { plugin: string; state?: unknown }): void
  row: StateTypeReturnType<RowsState>[0]
  rows: StateTypeReturnType<RowsState>
  index: number
  plugins: ReturnTypeFromSelector<typeof getPlugins>
}) {
  const container = React.useRef<HTMLDivElement>(null)
  const dispatch = useScopedDispatch()
  const store = useScopedStore()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [collectedDragProps, drag, dragPreview] = useDrag({
    item: { id: row.id, type: 'row', serialized: { plugin: '', state: '' } },
    begin() {
      const serialized = serializeDocument(row.id)(store.getState())
      return { id: row.id, type: 'row', serialized }
    },
    end(_item, monitor) {
      if (!monitor.didDrop()) return
      rows.remove(index)
    },
    collect(monitor) {
      return {
        isDragging: !!monitor.isDragging()
      }
    }
  })
  const [collectedDropProps, drop] = useDrop({
    accept: ['row', NativeTypes.FILE, NativeTypes.URL],
    collect(monitor) {
      return {
        isDragging:
          monitor.getItemType() === 'row' &&
          monitor.canDrop() &&
          monitor.isOver({ shallow: true }),
        isDraggingAbove:
          monitor.getItemType() === 'row' &&
          monitor.canDrop() &&
          monitor.isOver({ shallow: true }) &&
          isDraggingAbove(monitor),
        id:
          monitor.getItemType() === 'row'
            ? (monitor.getItem().id as string)
            : null
      }
    },
    drop(item: RowDragObject, monitor) {
      const type = monitor.getItemType()
      // handled in nested drop zone
      if (monitor.didDrop()) return

      if (type !== NativeTypes.FILE && type !== NativeTypes.URL) {
        if (item.id === row.id) return

        const draggingAbove = isDraggingAbove(monitor)
        insert(draggingAbove ? index : index + 1, item.serialized)
        return
      }

      const dropIndex = index

      let transfer: DataTransfer
      if (type === NativeTypes.FILE) {
        const files: File[] = monitor.getItem().files
        transfer = createFakeDataTransfer(files)
      } else {
        // NativeTypes.URL
        const urls: string[] = monitor.getItem().urls
        transfer = createFakeDataTransfer([], urls[0])
      }

      for (const key in plugins) {
        const { onPaste } = plugins[key]
        if (typeof onPaste === 'function') {
          const result = onPaste(transfer)
          if (result !== undefined) {
            if (isDraggingAbove(monitor)) {
              insert(dropIndex, { plugin: key, state: result.state })
            } else {
              insert(dropIndex + 1, {
                plugin: key,
                state: result.state
              })
            }
            return
          }
        }
      }
    }
  })

  const pluginProps = React.useMemo(() => {
    return {
      insert: (options?: { plugin: string; state?: unknown }) =>
        rows.insert(index + 1, options),
      replace: (options?: { plugin: string; state?: unknown }) => {
        rows.remove(index)
        rows.insert(index, options)
      },
      remove: () => {
        rows.remove(index)
      },
      mergeWithPrevious: (merge: (statePrevious: unknown) => unknown) => {
        if (index - 1 < 0) return

        const current = getDocument(row.id)(store.getState())

        let previous = getDocument(rows[index - 1].id)(store.getState())
        if (!previous || !current) return

        if (previous.plugin !== current.plugin) {
          // check if previous focus plugin is the same type
          const root = getFocusTree()(store.getState())
          if (!root) return

          const previousFocusId = findPreviousNode(root, row.id)
          if (!previousFocusId) return

          previous = getDocument(previousFocusId)(store.getState())
          if (!previous || previous.plugin !== current.plugin) return

          const merged = merge(previous.state)
          dispatch(
            change({
              id: previousFocusId,
              state: { initial: () => merged }
            })
          )
          rows.remove(index)
        } else {
          merge(previous.state)
          setTimeout(() => rows.remove(index - 1))
        }
      },
      mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
        if (index + 1 === rows.length) return
        const current = getDocument(row.id)(store.getState())
        let next = getDocument(rows[index + 1].id)(store.getState())
        if (!next || !current) return
        if (next.plugin !== current.plugin) {
          // check if next focus plugin is the same type
          const root = getFocusTree()(store.getState())
          if (!root) return

          const nextFocusId = findNextNode(root, row.id)
          if (!nextFocusId) return

          // use that plugin for merge
          next = getDocument(nextFocusId)(store.getState())
          if (!next || next.plugin !== current.plugin) return
        }

        merge(next.state)
        setTimeout(() => {
          rows.remove(index + 1)
        })
      },
      renderSettings(children: React.ReactNode, { close }: { close(): void }) {
        return (
          <React.Fragment>
            {children}
            <hr />
            <ButtonContainer>
              <Left>
                <BorderlessOverlayButton
                  onClick={() => {
                    const document = getDocument(row.id)(store.getState())
                    if (!document) return
                    rows.insert(index, document)
                    close()
                  }}
                  label="Duplizieren"
                >
                  <Icon icon={faCopy} /> Duplizieren
                </BorderlessOverlayButton>
                <BorderlessOverlayButton
                  onClick={() => {
                    rows.remove(index)
                    close()
                  }}
                  label="Löschen"
                >
                  <Icon icon={faTrashAlt} /> Löschen
                </BorderlessOverlayButton>
              </Left>
              <div>
                <BorderlessOverlayButton
                  onClick={() => {
                    close()
                  }}
                  label="Schließen"
                />
              </div>
            </ButtonContainer>
          </React.Fragment>
        )
      },
      renderToolbar(children: React.ReactNode) {
        return (
          <React.Fragment>
            <DragToolbarButton
              ref={drag}
              icon={<EdtrIcon icon={edtrDragHandle} />}
              label="Verschiebe das Element innerhalb des Dokuments"
            />
            {children}
          </React.Fragment>
        )
      }
    }
  }, [drag, store, dispatch, index, row.id, rows])

  dragPreview(drop(container))

  return (
    <div ref={container} >
      {collectedDropProps.isDragging &&
      collectedDropProps.isDraggingAbove &&
      collectedDropProps.id &&
      collectedDropProps.id !== row.id ? (
        <SubDocument id={collectedDropProps.id} />
      ) : null}
      {collectedDragProps.isDragging ? (
        <GrayOut>{row.render(pluginProps)}</GrayOut>
      ) : (
        <div>{row.render(pluginProps)}</div>
      )}
      {collectedDropProps.isDragging &&
      !collectedDropProps.isDraggingAbove &&
      collectedDropProps.id &&
      collectedDropProps.id !== row.id ? (
        <SubDocument id={collectedDropProps.id} />
      ) : null}
    </div>
  )

  function isDraggingAbove(monitor: DropTargetMonitor) {
    if (!container.current) {
      return false
    }
    const domBoundingRect = container.current.getBoundingClientRect()

    const domMiddleY = (domBoundingRect.bottom - domBoundingRect.top) / 2
    const dropClientOffset = monitor.getClientOffset()
    const dragClientY = dropClientOffset
      ? dropClientOffset.y - domBoundingRect.top
      : 0

    return dragClientY < domMiddleY
  }
}

// Needed until we get the correct dataTransfer (see e.g. https://github.com/react-dnd/react-dnd/issues/635)
function createFakeDataTransfer(files: File[], text?: string) {
  class FakeDataTransfer extends DataTransfer {
    public dropEffect = 'all'
    public effectAllowed = 'all'
    public files = (files as unknown) as FileList
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
