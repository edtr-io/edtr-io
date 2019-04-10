import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ExpandableBox, EditorThemeProvider } from '@edtr-io/ui'
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
    <EditorThemeProvider
      theme={{
        ui: {
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
    </EditorThemeProvider>
  )
}
