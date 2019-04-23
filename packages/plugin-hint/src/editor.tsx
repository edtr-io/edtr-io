import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ThemeProvider } from '@edtr-io/ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { hintState } from '.'

export function HintEditor({
  state,
  editable
}: StatefulPluginEditorProps<typeof hintState>) {
  const title = (
    <React.Fragment>
      Hinweis{' '}
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
            toggleBackgroundColor: '#a7d21d',
            toggleColor: undefined,
            containerBorderColor: '#a7d21d'
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
