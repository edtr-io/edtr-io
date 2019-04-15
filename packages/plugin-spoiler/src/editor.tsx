import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ThemeProvider } from '@edtr-io/ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { spoilerState } from '.'

export function SpoilerEditor({
  state,
  editable
}: StatefulPluginEditorProps<typeof spoilerState>) {
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
            toggleBackgroundColor: '#f5f5f5',
            toggleColor: undefined,
            containerBorderColor: '#f5f5f5'
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
