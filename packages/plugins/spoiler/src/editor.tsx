import { EditorInput } from '@edtr-io/editor-ui'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { SpoilerProps } from '.'
import { useSpoilerConfig } from './config'

export function SpoilerEditor(props: SpoilerProps) {
  const { state, editable, autofocusRef } = props
  const config = useSpoilerConfig(props.config)
  const { theme } = config
  const spoilerTheme = React.useMemo(() => {
    return {
      rendererUi: {
        expandableBox: {
          toggleBackgroundColor: theme.color,
          toggleColor: '#333',
          containerBorderColor: theme.color,
        },
      },
    }
  }, [theme])

  const renderTitle = React.useCallback(
    (_collapsed: boolean) => {
      return editable ? (
        <EditorInput
          onChange={(e) => state.title.set(e.target.value)}
          value={state.title.value}
          placeholder={config.i18n.title.placeholder}
          ref={autofocusRef}
        />
      ) : (
        <React.Fragment>{state.title.value}</React.Fragment>
      )
    },
    [config.i18n.title.placeholder, autofocusRef, editable, state.title]
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
