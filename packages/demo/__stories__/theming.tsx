import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'
import { Story } from '.'
import { Theming } from '@edtr-io/ui'

storiesOf('Theming', module).add('Initial State', () => {
  const state = {
    plugin: 'rows',
    state: [{ plugin: 'text' }]
  }

  const theme: Theming = {
    textColor: '#222',
    backgroundColor: '#d9edf7',
    buttonBackgroundColor: 'transparent',
    highlightColor: '#007ec1'
  }

  return (
    <ThemeProvider theme={theme}>
      <Story defaultPlugin="text" initialState={state} />
    </ThemeProvider>
  )
})
