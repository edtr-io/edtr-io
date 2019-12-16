import { EditorInput } from '@edtr-io/editor-ui'
import { DeprecatedPluginEditorProps } from '@edtr-io/plugin'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider, usePluginTheme } from '@edtr-io/ui'
import * as React from 'react'

import { spoilerState, SpoilerTheme } from '.'

export function SpoilerEditor({
  state,
  editable,
  name,
  defaultFocusRef
}: DeprecatedPluginEditorProps<typeof spoilerState>) {
  const theme = usePluginTheme<SpoilerTheme>(name, () => {
    return {
      color: '#f5f5f5'
    }
  })

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
