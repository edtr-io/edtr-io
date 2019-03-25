import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { EditorTheming } from '@edtr-io/ui'

import { EditorStory } from '../src'

storiesOf('Theming/Editor UI', module).add('Initial State', () => {
  const state = {
    plugin: 'rows',
    state: [{ plugin: 'text' }]
  }

  const theme: EditorTheming = {
    textColor: '#222',
    backgroundColor: '#d9edf7',
    buttonBackgroundColor: 'transparent',
    highlightColor: '#007ec1'
  }

  return (
    <ThemeProvider theme={theme}>
      <EditorStory defaultPlugin="text" initialState={state} />
    </ThemeProvider>
  )
})
