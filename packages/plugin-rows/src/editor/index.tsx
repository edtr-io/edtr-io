import {
  StatefulPluginEditorProps,
  selectors,
  useStore,
  ScopeContext
} from '@edtr-io/core'
import * as React from 'react'

import { Row } from './row'
import { Separator } from './separator'
import { rowsState } from '..'

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  const store = useStore()
  const { scope } = React.useContext(ScopeContext)
  const [menu, setMenu] = React.useState<
    | {
        index: number
        onClose: (pluginState: { plugin: string; state?: unknown }) => void
      }
    | undefined
  >(undefined)

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

  return (
    <div style={{ position: 'relative', marginTop: '25px' }}>
      <Separator
        name={props.name}
        isFirst
        focused={rows.items.length == 0}
        onClick={() => {
          rows.insert(0, {
            plugin: 'text'
          })
          openMenu(0, 1)
        }}
      />
      {rows.items.map((row, index) => {
        const doc = selectors.getDocument(store.getState(), row.id)

        if (!doc) return null
        return (
          <div key={row.id} style={{ position: 'relative' }}>
            <Row
              {...props}
              index={index}
              doc={doc}
              fullStore={store}
              moveRow={rows.move}
              insert={rows.insert}
              scope={scope}
              openMenu={openMenu}
              menu={menu}
              setMenu={setMenu}
            />
          </div>
        )
      })}
    </div>
  )
}
