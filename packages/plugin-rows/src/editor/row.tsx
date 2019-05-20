import * as React from 'react'
import { createPortal } from 'react-dom'
import {
  getDocument,
  StatefulPluginEditorProps,
  PluginState,
  EditorContextValue
} from '@edtr-io/core'
import { OnClickOutside } from '@edtr-io/editor-ui'

import { Menu } from './menu'
import { Separator } from './Separator'
import render from './render'
import { rowsState } from '..'
import { RowContainer } from '../row-container'
import { connectDnD, CollectedProps, TargetProps } from './DnDHOC'
import {
  Controls,
  ExtendedSettingsWrapper,
  createPrimarySettingsWrapper
} from './controls'

export type RowSourceProps = StatefulPluginEditorProps<typeof rowsState> &
  CollectedProps &
  TargetProps & {
    index: number
    doc: PluginState
    store: EditorContextValue
  }
const RowSource = React.forwardRef<
  { getNode: () => HTMLDivElement | null },
  RowSourceProps
>((props, ref) => {
  const [expanded, setExpanded] = React.useState(false)
  const [menu, setMenu] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)
  const [showExtendedSettings, setShowExtendedSettings] = React.useState(false)
  const rows = props.state
  const index = props.index
  const row = rows()[index]

  function openMenu(insertIndex: number, replaceIndex?: number) {
    setMenu({
      index: insertIndex,
      onClose: pluginState => {
        rows.insert(insertIndex, pluginState)
        setMenu(undefined)
        if (typeof replaceIndex === 'number') {
          rows.remove(replaceIndex)
        }
      }
    })
  }

  // DnD
  const rowRef = React.useRef<HTMLDivElement>(null)
  if (props.connectDragSource) {
    props.connectDragPreview(rowRef)
    props.connectDropTarget(rowRef)
    // const opacity = isDragging ? 0 : 1
    React.useImperativeHandle(ref, () => ({
      getNode: () => rowRef.current
    }))
  }

  const extendedSettingsNode = React.useRef<HTMLDivElement>(null)

  return (
    <OnClickOutside
      onClick={() => {
        if (showExtendedSettings) {
          return
        }
        setExpanded(false)
      }}
    >
      <RowContainer
        ref={rowRef}
        noHeight={props.doc.plugin === 'notes' && !props.editable}
        name={props.name}
        isFirst={index === 0}
        expanded={expanded}
        onMouseDown={() => {
          setExpanded(true)
        }}
      >
        {index === 0 && (
          <Separator
            name={props.name}
            isFirst={true}
            onClick={() => openMenu(index)}
          />
        )}

        {render({
          row,
          rows,
          index,
          store: props.store,
          getDocument,
          renderIntoExtendedSettings: children => {
            if (!extendedSettingsNode.current) return null

            return createPortal(children, extendedSettingsNode.current)
          },
          PrimarySettingsWrapper: createPrimarySettingsWrapper({
            expanded
          })
        })}
        <ExtendedSettingsWrapper
          hideExtendedSettings={() => {
            setShowExtendedSettings(false)
          }}
          expanded={expanded}
          index={index}
          rows={rows}
          duplicateRow={() => rows.insert(index, props.doc)}
          ref={extendedSettingsNode}
          extendedSettingsVisible={showExtendedSettings}
          name={props.name}
        />
        <Separator name={props.name} onClick={() => openMenu(index + 1)} />
        {props.editable && (
          <React.Fragment>
            <Controls
              name={props.name}
              index={index}
              expanded={expanded}
              setShowExtendedSettings={setShowExtendedSettings}
              rows={rows}
              row={row}
              connectDragSource={props.connectDragSource}
            />
            <Menu
              visible={!!menu}
              menu={menu}
              setMenu={setMenu}
              store={props.store}
              name={props.name}
            />
          </React.Fragment>
        )}
      </RowContainer>
    </OnClickOutside>
  )
})
export const Row = connectDnD(RowSource)
