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
import { rowsState, createRowPluginTheme } from '..'
import { ThemeProps } from '@edtr-io/ui'

export const RowContainer = styled.div<{
  isFirst?: boolean
  editable?: boolean
  name: string
}>(
  ({
    isFirst,
    editable,
    name,
    ...props
  }: {
    isFirst?: boolean
    editable?: boolean
    name: string
  } & ThemeProps) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      minHeight: '10px',
      position: 'relative',
      borderRight: '3px solid transparent',
      transition: '250ms all ease-in-out',
      margin: '25px',
      marginTop: isFirst ? '25px' : 0,
      '&:hover': {
        borderColor: editable ? theme.backgroundColor : 'transparent'
      },

      '&:hover .row-controls': {
        opacity: 1
      }
    }
  }
)

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
      name={props.name}
      editable={props.editable}
      isFirst={index === 0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {index === 0 && (
        <Separator
          name={props.name}
          isFirst={true}
          onClick={() => openMenu(index)}
        />
      )}

      {render({ row, rows, index, state: store.state, getDocument })}
      <Separator name={props.name} onClick={() => openMenu(index + 1)} />
      {props.editable && (
        <Controls
          name={props.name}
          hover={hover}
          index={index}
          rows={rows}
          copyToClipboard={copyToClipboard}
          row={row}
        />
      )}
      {props.editable && isEmptyTextPlugin && (
        <Add
          name={props.name}
          onClick={() => openMenu(index + 1, index)}
          inline
        />
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
