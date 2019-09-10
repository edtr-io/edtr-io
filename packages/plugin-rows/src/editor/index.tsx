import { useScopedStore } from '@edtr-io/core'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { getDocument } from '@edtr-io/store'
import * as React from 'react'

import { Menu } from './menu'
import { Row } from './row'
import { Separator } from './separator'
import { rowsState, PluginRegistry } from '..'

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState> & {
    plugins?: PluginRegistry
  }
) => {
  const rows = props.state
  const store = useScopedStore()
  const [menu, setMenu] = React.useState<
    | {
        index: number
        onClose: (pluginState: { plugin: string; state?: unknown }) => void
      }
    | undefined
  >(undefined)

  const openMenu = React.useCallback(
    (insertIndex: number) => {
      setMenu({
        index: insertIndex,
        onClose: pluginState => {
          rows.insert(insertIndex, pluginState)
          setMenu(undefined)
        }
      })
    },
    [rows]
  )

  return (
    <div style={{ position: 'relative', marginTop: '25px' }}>
      <Separator
        name={props.name}
        isFirst
        focused={rows.items.length == 0}
        onClick={() => {
          openMenu(0)
        }}
      />
      {rows.items.map((row, index) => {
        const doc = getDocument(row.id)(store.getState())

        if (!doc) return null
        return (
          <div key={row.id} style={{ position: 'relative' }}>
            <Row
              {...props}
              index={index}
              doc={doc}
              moveRow={rows.move}
              insert={rows.insert}
              openMenu={openMenu}
            />
          </div>
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
