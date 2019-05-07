import * as React from 'react'
import { styled } from '@edtr-io/editor-ui'
import {
  getDocument,
  StatefulPluginEditorProps,
  PluginState,
  isEmpty,
  State,
  getPlugins,
  copyToClipboard,
  Plugin,
  getFocusTree,
  change
} from '@edtr-io/core'

import { Menu } from './menu'
import { Controls } from './Controls'
import { Add, Separator } from './Separator'
import render from './render'
import { rowsState, createRowPluginTheme } from '..'
import { ThemeProps } from '@edtr-io/ui'
import { connect } from 'react-redux'

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

const RowConnector = (
  props: StatefulPluginEditorProps<typeof rowsState> & {
    index: number
  } & RowProps &
    RowDispatchProps
) => {
  const [hover, setHover] = React.useState<boolean>(false)
  const [menu, setMenu] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)
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

  const doc = props.getDocument(row.id)
  const isEmptyTextPlugin =
    doc && doc.plugin === 'text' && props.isEmpty(row.id)

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

      {render({
        row,
        rows,
        index,
        getDocument: props.getDocument,
        getFocusTree: props.getFocusTree,
        change: props.change
      })}
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
      <Menu visible={!!menu} menu={menu} setMenu={setMenu} name={props.name} />
    </RowContainer>
  )
}

const mapStateToProps = (state: State): RowProps => ({
  plugins: getPlugins(state),
  getDocument: (id: string) => getDocument(state, id),
  isEmpty: (id: string) => isEmpty(state, id),
  getFocusTree: () => getFocusTree(state)
})

const mapDispatchToProps: RowDispatchProps = {
  copyToClipboard,
  change
}

export const Row = connect(
  mapStateToProps,
  mapDispatchToProps
)(RowConnector)

export interface RowProps {
  plugins: Record<string, Plugin>
  getDocument: (id: string) => PluginState | null
  isEmpty: (id: string) => boolean
  getFocusTree: () => ReturnType<typeof getFocusTree>
}

export interface RowDispatchProps {
  copyToClipboard: typeof copyToClipboard
  change: typeof change
}
