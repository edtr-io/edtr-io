import { useScopedSelector } from '@edtr-io/core'
import {
  DeprecatedPluginEditorProps,
  StateTypeReturnType
} from '@edtr-io/plugin'
import { getPlugins, isFocused } from '@edtr-io/store'
import * as React from 'react'

import { Menu } from './menu'
import { RowRenderer } from './render'
import { Separator } from './separator'
import { rowsState, rowState, PluginRegistry } from '..'

function RowEditor({
  insert,
  openMenu,
  moveRow,
  index,
  row,
  rows,
  name
}: {
  insert(index: number, options?: { plugin: string; state?: unknown }): void
  openMenu(index: number): void
  moveRow(from: number, to: number): void
  index: number
  rows: StateTypeReturnType<typeof rowsState>
  row: StateTypeReturnType<typeof rowState>
  name: string
}) {
  const focused = useScopedSelector(isFocused(row.id))
  const plugins = useScopedSelector(getPlugins())

  return (
    <div key={row.id} style={{ position: 'relative' }}>
      <RowRenderer
        insert={insert}
        moveRow={moveRow}
        row={row}
        rows={rows}
        index={index}
        plugins={plugins}
      />
      <Separator
        name={name}
        focused={focused}
        onClick={() => {
          openMenu(index + 1)
        }}
      />
    </div>
  )
}

export function RowsEditor(
  props: DeprecatedPluginEditorProps<typeof rowsState> & {
    plugins?: PluginRegistry
  }
) {
  const [menu, setMenu] = React.useState<
    | {
        index: number
        onClose: (pluginState: { plugin: string; state?: unknown }) => void
      }
    | undefined
  >(undefined)

  function openMenu(insertIndex: number) {
    setMenu({
      index: insertIndex,
      onClose: pluginState => {
        props.state.insert(insertIndex, pluginState)
        setMenu(undefined)
      }
    })
  }

  return (
    <div style={{ position: 'relative', marginTop: '25px' }}>
      <Separator
        name={props.name}
        isFirst
        focused={props.state.length == 0}
        onClick={() => {
          openMenu(0)
        }}
      />
      {props.state.map((row, index) => {
        return (
          <RowEditor
            key={row.id}
            insert={(index, options) => {
              props.state.insert(index, options)
            }}
            openMenu={() => {
              openMenu(index + 1)
            }}
            moveRow={(from, to) => {
              props.state.move(from, to)
            }}
            index={index}
            rows={props.state}
            row={row}
            name={props.name}
          />
        )
      })}
      {menu ? (
        <Menu
          menu={menu}
          setMenu={setMenu}
          name={props.name}
          registry={props.plugins}
        />
      ) : null}
    </div>
  )
}
