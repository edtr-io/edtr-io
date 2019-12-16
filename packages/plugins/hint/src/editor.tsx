import { DeprecatedPluginEditorProps } from '@edtr-io/plugin'
import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { hintState } from '.'

const hintTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: '#eee',
      containerBorderColor: '#333'
    }
  }
}

export function HintEditor({
  state,
  editable
}: DeprecatedPluginEditorProps<typeof hintState>) {
  const renderTitle = React.useCallback((collapsed: boolean) => {
    return (
      <React.Fragment>
        Tipp {collapsed ? 'anzeigen' : 'ausblenden'}
      </React.Fragment>
    )
  }, [])
  return (
    <ThemeProvider theme={hintTheme}>
      <ExpandableBox renderTitle={renderTitle} editable={editable}>
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
