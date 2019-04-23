import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ThemeProvider, usePluginTheme } from '@edtr-io/ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { spoilerState, SpoilerTheme } from '.'

export function SpoilerEditor({
  state,
  editable,
  name
}: StatefulPluginEditorProps<typeof spoilerState>) {
  const theme = usePluginTheme<SpoilerTheme>(name, () => {
    return {
      color: '#f5f5f5'
    }
  })

  const title = editable ? (
    <input
      onChange={e => state.title.set(e.target.value)}
      value={state.title()}
      placeholder="Titel eingeben"
    />
  ) : state.title() ? (
    state.title()
  ) : null

  return (
    <ThemeProvider
      theme={{
        rendererUi: {
          expandableBox: {
            toggleBackgroundColor: theme.color,
            toggleColor: undefined,
            containerBorderColor: theme.color
          }
        }
      }}
    >
      <ExpandableBox title={title} editable={editable}>
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
