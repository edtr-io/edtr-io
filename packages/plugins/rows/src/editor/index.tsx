import { useScopedSelector } from '@edtr-io/core'
import { StateTypeReturnType } from '@edtr-io/plugin'
import { getPlugins, isFocused } from '@edtr-io/store'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { RowsRenderer } from '../renderer'
import { Menu } from './menu'
import { RowRenderer } from './render'
import { Separator } from './separator'
import { RowsConfig, RowsProps, RowsState } from '..'

const DropContainer = styled.div({
  position: 'relative',
  // increase dropZone
  marginLeft: '-50px',
  paddingLeft: '50px'
})

function RowEditor({
  config,
  openMenu,
  index,
  row,
  rows
}: {
  config: RowsConfig
  openMenu(index: number): void
  index: number
  rows: StateTypeReturnType<RowsState>
  row: StateTypeReturnType<RowsState>[0]
}) {
  const focused = useScopedSelector(isFocused(row.id))
  const plugins = useScopedSelector(getPlugins())
  const dropContainer = React.useRef<HTMLDivElement>(null)

  return (
    <DropContainer key={row.id} ref={dropContainer}>
      <RowRenderer
        row={row}
        rows={rows}
        index={index}
        plugins={plugins}
        dropContainer={dropContainer}
      />
      <Separator
        config={config}
        focused={focused}
        onClick={() => {
          openMenu(index + 1)
        }}
      />
    </DropContainer>
  )
}

export function RowsEditor(props: RowsProps) {
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

  if (!props.editable) return <RowsRenderer {...props} />

  return (
    <div style={{ position: 'relative', marginTop: '25px' }}>
      <Separator
        config={props.config}
        isFirst
        focused={props.state.length == 0}
        onClick={() => {
          openMenu(0)
        }}
      />
      {props.state.map((row, index) => {
        return (
          <RowEditor
            config={props.config}
            key={row.id}
            openMenu={() => {
              openMenu(index + 1)
            }}
            index={index}
            rows={props.state}
            row={row}
          />
        )
      })}
      {menu ? (
        <Menu
          menu={menu}
          setMenu={setMenu}
          name={props.name}
          config={props.config}
        />
      ) : null}
    </div>
  )
}
