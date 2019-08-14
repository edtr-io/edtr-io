import { StatefulPluginEditorProps } from '@edtr-io/core'
import { EditorInput, styled } from '@edtr-io/editor-ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { solutionState } from '.'

const EditorInputWithMarginLeft = styled(EditorInput)({
  marginLeft: '5px',
  paddingLeft: '3px',
  '&:focus': {
    borderColor: 'black'
  }
})

const solutionTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: '#d9edf7',
      containerBorderColor: '#d9edf7'
    }
  }
}

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
    <ThemeProvider theme={solutionTheme}>
      <ExpandableBox title={title} editable={editable}>
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
