import {
  OverlayButton,
  PluginToolbarButton,
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
import * as R from 'ramda'
import * as React from 'react'
import {
  DragObjectWithType,
  DropTargetMonitor,
  useDrag,
  useDrop
} from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { useCanDrop } from './use-can-drop'
import { RowsConfig, RowsState } from '..'

interface RowDragObject extends DragObjectWithType {
  type: 'row'
  id: string
  serialized: DocumentState
  onDrop(): void
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

const Inserted = styled.hr<{ config: RowsConfig }>(({ config }) => {
  return {
    border: `1px solid ${config.theme.highlightColor}`
  }
})

const validFileTypes = [NativeTypes.FILE, NativeTypes.URL]

export function RowRenderer({
  config,
  row,
  rows,
  index,
  plugins,
  dropContainer
}: {
  config: RowsConfig
  row: StateTypeReturnType<RowsState>[0]
  rows: StateTypeReturnType<RowsState>
  index: number
  plugins: ReturnTypeFromSelector<typeof getPlugins>
  dropContainer: React.RefObject<HTMLDivElement>
}) {
  const container = React.useRef<HTMLDivElement>(null)
  const [draggingAbove, setDraggingAbove] = React.useState(true)
  const canDrop = useCanDrop(row.id, draggingAbove)
  const dispatch = useScopedDispatch()
  const store = useScopedStore()

  const [collectedDragProps, drag, dragPreview] = useDrag({
    item: {
      id: row.id,
      type: 'row',
      serialized: { plugin: '', state: '' },
      onDrop() {}
    },
    begin() {
      const serialized = serializeDocument(row.id)(store.getState())
      return {
        id: row.id,
        type: 'row',
        serialized,
        onDrop() {
          rows.set(list => {
            const i = R.findIndex(id => id === row.id, list)
            return R.remove(i, 1, list)
          })
        }
      }
    },
    collect(monitor) {
      return {
        isDragging: !!monitor.isDragging()
      }
    }
  })
  const [collectedDropProps, drop] = useDrop({
    accept: ['row', ...validFileTypes],
    collect(monitor): { isDragging: boolean; isFile?: boolean; id?: string } {
      const type = monitor.getItemType()
      const isDragging = monitor.canDrop() && monitor.isOver({ shallow: true })
      if (isFileType(type)) {
        return {
          isDragging,
          isFile: true
        }
      }

      if (type == 'row') {
        return {
          isDragging,
          id: monitor.getItem().id as string
        }
      }

      return {
        isDragging: false
      }
    },
    hover(item: RowDragObject, monitor) {
      if (
        monitor.getItemType() === 'row' &&
        monitor.canDrop() &&
        monitor.isOver({ shallow: true })
      ) {
        setDraggingAbove(isDraggingAbove(monitor))
      }
    },
    drop(item: RowDragObject, monitor) {
      const type = monitor.getItemType()
      // handled in nested drop zone
      if (monitor.didDrop()) return

      if (!isFileType(type)) {
        if (!canDrop(item.id)) return

        const draggingAbove = isDraggingAbove(monitor)
        rows.set((list, deserializer) => {
          const i = R.findIndex(id => id === row.id, list)
          return R.insert(
            draggingAbove ? i : i + 1,
            deserializer(item.serialized),
            list
          )
        })
        item.onDrop()
        return
      }

      const dropIndex = index

      let transfer: DataTransfer

      switch (type) {
        case NativeTypes.FILE: {
          const files: File[] = monitor.getItem().files
          transfer = createFakeDataTransfer(files)
          break
        }
        case NativeTypes.URL: {
          const urls: string[] = monitor.getItem().urls
          transfer = createFakeDataTransfer([], urls[0])
          break
        }
      }

      for (const key in plugins) {
        const { onPaste } = plugins[key]
        if (typeof onPaste === 'function') {
          const result = onPaste(transfer)
          if (result !== undefined) {
            if (isDraggingAbove(monitor)) {
              rows.insert(dropIndex, { plugin: key, state: result.state })
            } else {
              rows.insert(dropIndex + 1, {
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

  dragPreview(drop(dropContainer))
  const dropPreview =
    collectedDropProps.isDragging &&
    (collectedDropProps.isFile || canDrop(collectedDropProps.id)) ? (
      <Inserted config={config} />
    ) : null

  return (
    <React.Fragment>
      {draggingAbove ? dropPreview : null}
      <div ref={container}>
        {collectedDragProps.isDragging ? (
          <GrayOut>{row.render(pluginProps)}</GrayOut>
        ) : (
          <div>{row.render(pluginProps)}</div>
        )}
      </div>
      {!draggingAbove ? dropPreview : null}
    </React.Fragment>
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

function isFileType(
  type: ReturnType<DropTargetMonitor['getItemType']>
): type is typeof NativeTypes.FILE | typeof NativeTypes.URL {
  return validFileTypes.includes(type as string)
}
