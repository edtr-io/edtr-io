import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ThemeProvider } from '@edtr-io/ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { solutionState } from '.'

export function SolutionEditor({
  state,
  editable
}: StatefulPluginEditorProps<typeof solutionState>) {
  const title = (
    <React.Fragment>
      Lösung{' '}
      {editable ? (
        <input
          onChange={e => state.title.set(e.target.value)}
          value={state.title()}
          placeholder="Zusätzlicher Name"
        />
      ) : state.title() ? (
        state.title()
      ) : null}
    </React.Fragment>
  )

  return (
    <ThemeProvider
      theme={{
        rendererUi: {
          expandableBox: {
            toggleBackgroundColor: '#d9edf7',
            toggleColor: undefined,
            containerBorderColor: '#d9edf7'
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
