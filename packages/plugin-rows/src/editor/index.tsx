import * as React from 'react'
import {
  EditorContext,
  getDocument,
  StatefulPluginEditorProps
} from '@edtr-io/core'
import { ThemeProvider, usePluginTheme } from '@edtr-io/ui'

import { rowsPluginThemeFactory, rowsState } from '..'
import { Row } from './row'

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  const store = React.useContext(EditorContext)
  const settingsTheme = usePluginTheme(props.name, rowsPluginThemeFactory)
  return (
    <ThemeProvider
      theme={{
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
      }}
    >
      <React.Fragment>
        {rows.items.map((row, index) => {
          const doc = getDocument(store.state, row.id)
          return (
            //TODO: remove this wrapper if its not needed
            <div key={row.id} style={{ position: 'relative' }}>
              <Row
                {...props}
                index={index}
                doc={doc}
                store={store}
                moveRow={(dragIndex: number, hoverIndex: number) => {
                  rows.move(dragIndex, hoverIndex)
                }}
              />
            </div>
          )
        })}
      </React.Fragment>
    </ThemeProvider>
  )
}
