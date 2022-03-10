import {
  OverlayButton,
  PluginToolbarButton,
  useScopedStore,
} from '@edtr-io/core'
import { StateTypeReturnType } from '@edtr-io/plugin'
import {
  DocumentState,
  getPlugins,
  SelectorReturnType,
  serializeDocument,
} from '@edtr-io/store'
import {
  edtrDragHandle,
  EdtrIcon,
  faCopy,
  faTrashAlt,
  Icon,
  styled,
} from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { RowsPluginConfig, RowsPluginState } from '..'
import { useCanDrop } from './use-can-drop'

interface RowDragObject {
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
    cursor: 'grabbing',
  },
})

const ButtonContainer = styled.div({
  display: 'flex',
})

const Left = styled.div({
  flex: 1,
})

const BorderlessOverlayButton = styled(OverlayButton)({
  border: 'none !important',
  padding: '0 !important',
  minWidth: '0 !important',
})

const GrayOut = styled.div({
  opacity: 0.3,
})

const Inserted = styled.hr<{ config: RowsPluginConfig }>(({ config }) => {
  return {
    margin: 0,
    padding: 0,
    border: `1px solid ${config.theme.highlightColor}`,
  }
})

const validFileTypes = [NativeTypes.FILE, NativeTypes.URL]

export function RowRenderer({
  config,
  row,
  rows,
  index,
  plugins,
  dropContainer,
}: {
  config: RowsPluginConfig
  row: StateTypeReturnType<RowsPluginState>[0]
  rows: StateTypeReturnType<RowsPluginState>
  index: number
  plugins: SelectorReturnType<typeof getPlugins>
  dropContainer: React.RefObject<HTMLDivElement>
}) {
  const container = React.useRef<HTMLDivElement>(null)
  const [draggingAbove, setDraggingAbove] = React.useState(true)
  const allowedPlugins = React.useMemo(() => {
    return config.plugins.map((plugin) => plugin.name)
  }, [config])
  const canDrop = useCanDrop(row.id, draggingAbove, allowedPlugins)
  const store = useScopedStore()

  const [collectedDragProps, drag, dragPreview] = useDrag({
    type: 'row',
    item: () => {
      const serialized = serializeDocument(row.id)(store.getState())
      return {
        id: row.id,
        serialized,
        onDrop() {
          rows.set((list) => {
            const i = R.findIndex((id) => id === row.id, list)
            return R.remove(i, 1, list)
          })
        },
      }
    },
    collect(monitor) {
      return {
        isDragging: !!monitor.isDragging(),
      }
    },
  })
  const [collectedDropProps, drop] = useDrop<
    RowDragObject,
    unknown,
    { isDragging: boolean; isFile?: boolean; id?: string }
  >({
    accept: ['row', ...validFileTypes],
    collect(monitor): { isDragging: boolean; isFile?: boolean; id?: string } {
      const type = monitor.getItemType()
      const isDragging = monitor.canDrop() && monitor.isOver({ shallow: true })
      if (isFileType(type)) {
        return {
          isDragging,
          isFile: true,
        }
      }

      if (type == 'row') {
        return {
          isDragging,
          id: monitor.getItem<RowDragObject>().id,
        }
      }

      return {
        isDragging: false,
      }
    },
    hover(_item: RowDragObject, monitor) {
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
          const i = R.findIndex((id) => id === row.id, list)
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

      switch (type) {
        case NativeTypes.FILE: {
          const files: File[] = monitor.getItem<{ files: File[] }>().files
          for (const key in plugins) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const { onFiles } = plugins[key]
            if (typeof onFiles === 'function') {
              const result = onFiles(files)
              if (result !== undefined) {
                handleResult(key, result)
                return
              }
            }
          }
          break
        }
        case NativeTypes.URL: {
          const urls: string[] = monitor.getItem<{ urls: string[] }>().urls
          const text = urls[0]
          for (const key in plugins) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            const { onText } = plugins[key]
            if (typeof onText === 'function') {
              const result = onText(text)
              if (result !== undefined) {
                handleResult(key, result)
                return
              }
            }
          }
          break
        }
      }

      function handleResult(key: string, result: { state?: unknown }) {
        if (isDraggingAbove(monitor)) {
          rows.insert(dropIndex, { plugin: key, state: result.state })
        } else {
          rows.insert(dropIndex + 1, {
            plugin: key,
            state: result.state,
          })
        }
      }
    },
  })

  const pluginProps = React.useMemo(() => {
    return {
      renderSettings(children: React.ReactNode, { close }: { close(): void }) {
        return (
          <React.Fragment>
            {children}
            <hr />
            <ButtonContainer>
              <Left>
                <BorderlessOverlayButton
                  onClick={() => {
                    const document = serializeDocument(row.id)(store.getState())
                    if (!document) return
                    rows.insert(index, document)
                    close()
                  }}
                  label={config.i18n.settings.duplicateLabel}
                >
                  <Icon icon={faCopy} /> {config.i18n.settings.duplicateLabel}
                </BorderlessOverlayButton>
                <BorderlessOverlayButton
                  onClick={() => {
                    rows.remove(index)
                    close()
                  }}
                  label={config.i18n.settings.removeLabel}
                >
                  <Icon icon={faTrashAlt} /> {config.i18n.settings.removeLabel}
                </BorderlessOverlayButton>
              </Left>
              <div>
                <BorderlessOverlayButton
                  onClick={() => {
                    close()
                  }}
                  label={config.i18n.settings.closeLabel}
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
              label={config.i18n.toolbar.dragLabel}
            />
            {children}
          </React.Fragment>
        )
      },
    }
  }, [
    config.i18n.settings.duplicateLabel,
    config.i18n.settings.removeLabel,
    config.i18n.settings.closeLabel,
    config.i18n.toolbar.dragLabel,
    row.id,
    store,
    rows,
    index,
    drag,
  ])

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

function isFileType(
  type: ReturnType<DropTargetMonitor['getItemType']>
): type is typeof NativeTypes.FILE | typeof NativeTypes.URL {
  return validFileTypes.includes(type as string)
}
