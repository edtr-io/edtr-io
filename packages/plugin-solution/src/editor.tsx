import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ThemeProvider } from '@edtr-io/ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { solutionState } from '.'
import { EditorInput, styled } from '@edtr-io/editor-ui'

const EditorInputWithMarginLeft = styled(EditorInput)({
  marginLeft: '5px',
  paddingLeft: '3px',
  '&:focus': {
    borderColor: 'black'
  }
})
export function SolutionEditor({
  state,
  editable,
  focused
}: StatefulPluginEditorProps<typeof solutionState>) {
  const title = (
    <React.Fragment>
      Lösung
      {editable && focused ? (
        <EditorInputWithMarginLeft
          onChange={e => state.title.set(e.target.value)}
          value={state.title()}
          placeholder="Zusätzlicher Name"
        />
      ) : state.title() ? (
        <span> ({state.title()})</span>
      ) : null}
    </React.Fragment>
  )

  return (
    <ThemeProvider
      theme={{
        rendererUi: {
          expandableBox: {
            toggleBackgroundColor: '#d9edf7',
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
