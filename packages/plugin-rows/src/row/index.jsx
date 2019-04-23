import * as React from 'react'
import styled from 'styled-components'
import {
  getDocument,
  EditorContext,
  ActionType,
  getPlugins
} from '@edtr-io/core'

import Menu from './Menu'
import Controls from './Controls'
import Separator, { Add } from './Separator'
import render from './render'

export const RowContainer = styled.div`
  min-height: 10px;
  position: relative;
  border-right: 3px solid transparent;
  transition: 250ms all ease-in-out;
  margin: 25px;
  margin-top: ${props => (props.isFirst ? 25 : 0)}px;

  &:hover {
    border-color: ${props => props.editable && 'rgba(177, 4, 56, 1)'};
  }

  &:hover .row-controls {
    opacity: 1;
  }
`

export const Row = props => {
  const [hover, setHover] = React.useState(false)
  const [menu, setMenu] = React.useState(undefined)
  const store = React.useContext(EditorContext)
  const rows = props.state
  const index = props.index
  const row = rows()[index]

  function openMenu(insertIndex) {
    setMenu({
      index: insertIndex,
      onClose: pluginState => {
        rows.insert(insertIndex, pluginState)
        setMenu(undefined)
      }
    })
  }

  function copyToClipboard(id) {
    store.dispatch({
      type: ActionType.CopyToClipboard,
      payload: id
    })
  }

  const doc = getDocument(store.state, row.id)
  const isEmptyTextPlugin = doc.plugin === 'text' && !doc.state.document.data

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

      {render({ row, rows, index, store, getDocument })}
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
        store={store}
        name={props.name}
      />
    </RowContainer>
  )
}
