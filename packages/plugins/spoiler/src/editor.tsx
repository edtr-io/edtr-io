import { EditorInput } from '@edtr-io/editor-ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { SpoilerProps } from '.'

export function SpoilerEditor({
  config,
  state,
  editable,
  defaultFocusRef
}: SpoilerProps) {
  const { theme } = config
  const spoilerTheme = React.useMemo(() => {
    return {
      rendererUi: {
        expandableBox: {
          toggleBackgroundColor: theme.color,
          toggleColor: '#333',
          containerBorderColor: theme.color
        }
      }
    }
  }, [theme])

  const renderTitle = React.useCallback(
    (_collapsed: boolean) => {
      return editable ? (
        <EditorInput
          onChange={e => state.title.set(e.target.value)}
          value={state.title.value}
          placeholder="Titel eingeben"
          ref={defaultFocusRef}
        />
      ) : (
        <React.Fragment>{state.title.value}</React.Fragment>
      )
    },
    [defaultFocusRef, editable, state.title]
  )

  return (
    <ThemeProvider theme={spoilerTheme}>
      <ExpandableBox
        renderTitle={renderTitle}
        editable={editable}
        alwaysVisible
      >
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
