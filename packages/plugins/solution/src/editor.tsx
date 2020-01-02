import { ExpandableBox } from '@edtr-io/renderer-ui'
import { ThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

import { SolutionProps } from '.'

const solutionTheme = {
  rendererUi: {
    expandableBox: {
      toggleBackgroundColor: '#d9edf7',
      containerBorderColor: '#d9edf7'
    }
  }
}

export function SolutionEditor({ state, editable }: SolutionProps) {
  const renderTitle = React.useCallback((collapsed: boolean) => {
    return (
      <React.Fragment>
        Lösung {collapsed ? 'anzeigen' : 'ausblenden'}
      </React.Fragment>
    )
  }, [])

  return (
    <ThemeProvider theme={solutionTheme}>
      <ExpandableBox renderTitle={renderTitle} editable={editable}>
        {state.content.render()}
      </ExpandableBox>
    </ThemeProvider>
  )
}
