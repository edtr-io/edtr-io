import { EditorInput, styled } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { hintState } from '.'

const EditorInputWithMarginLeft = styled(EditorInput)({
  marginLeft: '5px',
  paddingLeft: '3px',
  '&:focus': {
    borderColor: 'black'
  }
})

const hintTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: '#d9edf7',
      containerBorderColor: '#333'
    }
  }
}

export function HintEditor({
  state,
  editable,
  focused
}: StatefulPluginEditorProps<typeof hintState>) {
  const title = (
    <React.Fragment>
      Hinweis
      {editable && focused ? (
        <EditorInputWithMarginLeft
          onChange={e => state.title.set(e.target.value)}
          value={state.title.value}
          placeholder="Zusätzlicher Name"
        />
      ) : state.title.value ? (
        <span> ({state.title.value})</span>
      ) : null}
    </React.Fragment>
  )

  return (
    <ThemeProvider theme={hintTheme}>
      <ExpandableBox title={title} editable={editable}>
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
