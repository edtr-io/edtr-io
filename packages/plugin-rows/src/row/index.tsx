import * as React from 'react'
import { styled } from '@edtr-io/editor-ui'
import {
  getDocument,
  EditorContext,
  ActionType,
  StatefulPluginEditorProps,
  PluginState,
  isEmpty
} from '@edtr-io/core'

import { Menu } from './menu'
import { Controls } from './Controls'
import { Add, Separator } from './Separator'
import render from './render'
import { rowsState } from '..'

export const RowContainer = styled.div<{
  isFirst?: boolean
  editable?: boolean
}>(({ isFirst, editable }) => {
  return {
    minHeight: '10px',
    position: 'relative',
    borderRight: '3px solid transparent',
    transition: '250ms all ease-in-out',
    margin: '25px',
    marginTop: isFirst ? '25px' : 0,
    '&:hover': {
      borderColor: editable ? 'rgba(177, 4, 56, 1)' : 'transparent'
    },

    '&:hover .row-controls': {
      opacity: 1
    }
  }
})

export const Row = (
  props: StatefulPluginEditorProps<typeof rowsState> & { index: number }
) => {
  const [hover, setHover] = React.useState<boolean>(false)
  const [menu, setMenu] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)
  const store = React.useContext(EditorContext)
  const rows = props.state
  const index = props.index
  const row = rows()[index]

  function openMenu(insertIndex: number) {
    setMenu({
      index: insertIndex,
      onClose: pluginState => {
        rows.insert(insertIndex, pluginState)
        setMenu(undefined)
      }
    })
  }

  function copyToClipboard(id: string) {
    store.dispatch({
      type: ActionType.CopyToClipboard,
      payload: id
    })
  }

  const doc = getDocument(store.state, row.id)
  const isEmptyTextPlugin =
    doc && doc.plugin === 'text' && isEmpty(store.state, row.id)

  return (
    <RowContainer
      editable={props.editable}
      isFirst={index === 0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {index === 0 && (
        <Separator isFirst={true} onClick={() => openMenu(index)} />
      )}

      {render({ row, rows, index, state: store.state, getDocument })}
      <Separator onClick={() => openMenu(index + 1)} />
      {props.editable && (
        <Controls
          hover={hover}
          index={index}
          rows={rows}
          copyToClipboard={copyToClipboard}
          row={row}
        />
      )}
      {props.editable && isEmptyTextPlugin && (
        <Add onClick={() => openMenu(index + 1)} inline />
      )}
      <Menu
        visible={!!menu}
        menu={menu}
        setMenu={setMenu}
        state={store.state}
        name={props.name}
      />
    </RowContainer>
  )
}
