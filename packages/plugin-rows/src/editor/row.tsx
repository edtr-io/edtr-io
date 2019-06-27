import { Plugin, StatefulPluginEditorProps, selectors } from '@edtr-io/core'
import { OnClickOutside, PrimarySettings } from '@edtr-io/editor-ui'
import { ThemeProvider, usePluginTheme } from '@edtr-io/ui'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { ReactReduxContextValue } from 'react-redux'

import { rowsPluginThemeFactory, rowsState } from '..'
import { RowContainer } from '../row-container'
import { Controls, ExtendedSettingsWrapper } from './controls'
import { connectDnD, CollectedProps, TargetProps } from './dnd-hoc'
import { Menu } from './menu'
import render from './render'
import { Separator } from './separator'

const PrimarySettingsWrapper: React.FunctionComponent = props => {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.warn(
      'PrimarySettingsWrapper of @edtr-io/plugin-rows is deprecated. Use PrimarySettings of @edtr-io/editor-ui instead.'
    )
  }, [])
  return <PrimarySettings {...props} />
}
export type RowSourceProps = StatefulPluginEditorProps<typeof rowsState> &
  CollectedProps &
  TargetProps & {
    moveRow: (from: number, to: number) => void
    insert: (
      index: number,
      options?: { plugin: string; state?: unknown }
    ) => void
    index: number
    doc: { plugin: string; state?: unknown }
    plugins: Record<string, Plugin>
    store: ReactReduxContextValue['store']
  }
const RowSource = React.forwardRef<
  { getNode: () => HTMLDivElement | null },
  RowSourceProps
>((props, ref) => {
  const [expanded, setExpanded] = React.useState(false)
  const [menu, setMenu] = React.useState<
    | {
        index: number
        onClose: (pluginState: { plugin: string; state?: unknown }) => void
      }
    | undefined
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

  React.useImperativeHandle(ref, () => {
    return { getNode: () => rowRef.current }
  })

  if (props.connectDragSource) {
    props.connectDragPreview(rowRef)
    props.connectDropTarget(rowRef)
    // const opacity = isDragging ? 0 : 1
  }

  const extendedSettingsNode = React.useRef<HTMLDivElement>(null)
  const settingsTheme = usePluginTheme(name, rowsPluginThemeFactory)

  const theme = React.useMemo(() => {
    return {
      editorUi: {
        overlay: {
          input: {
            backgroundColor: settingsTheme.backgroundColor,
            color: settingsTheme.menu.primary.color
          },
          button: {
            backgroundColor: settingsTheme.backgroundColor,
            color: settingsTheme.menu.primary.color,
            borderColor: settingsTheme.menu.primary.color
          },
          textarea: {
            backgroundColor: settingsTheme.backgroundColor,
            color: settingsTheme.menu.primary.color,
            borderColor: settingsTheme.menu.primary.color
          },
          checkbox: {
            color: settingsTheme.menu.primary.color,
            boxDeselectedColor: settingsTheme.backgroundColor,
            boxSelectedColor: settingsTheme.menu.primary.color
          }
        }
      }
    }
  }, [settingsTheme])

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
          getDocument: selectors.getDocument,
          renderIntoExtendedSettings: children => {
            if (!extendedSettingsNode.current) return null

            return createPortal(
              <ThemeProvider theme={theme}>{children}</ThemeProvider>,
              extendedSettingsNode.current
            )
          },
          PrimarySettingsWrapper
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
RowSource.displayName = 'RowSource'

export const Row = connectDnD(RowSource)
