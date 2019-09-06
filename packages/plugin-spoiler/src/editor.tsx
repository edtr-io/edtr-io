import { EditorInput } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider, usePluginTheme } from '@edtr-io/ui'
import * as React from 'react'

import { spoilerState, SpoilerTheme } from '.'

export function SpoilerEditor({
  state,
  editable,
  focused,
  name
}: StatefulPluginEditorProps<typeof spoilerState>) {
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

  const title =
    focused && editable ? (
      <EditorInput
        onChange={e => state.title.set(e.target.value)}
        value={state.title()}
        placeholder="Titel eingeben"
      />
    ) : state.title() ? (
      state.title()
    ) : (
      'Spoiler'
    )

  return (
    <ThemeProvider theme={spoilerTheme}>
      <ExpandableBox title={title} editable={editable} alwaysVisible>
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
