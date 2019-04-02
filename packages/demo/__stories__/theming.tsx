import { CustomEditorTheme } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'

storiesOf('Theming/Editor UI', module).add('Initial State', () => {
  const state = {
    plugin: 'rows',
    state: [{ plugin: 'text' }]
  }

  const theme: CustomEditorTheme = {
    editor: {
      color: '#222',
      backgroundColor: '#d9edf7',
      highlightColor: '#007ec1'
    },
    ui: {
      button: {
        color: 'green',
        backgroundColor: 'red',
        hoverBackgroundColor: 'green',
        hoverBorderColor: 'green'
      },
      checkbox: {
        boxSelectedColor: 'green',
        boxDeselectedColor: 'red',
        color: 'green'
      },
      input: {
        color: 'red',
        backgroundColor: 'green',
        focusColor: 'black'
      }
    }
  }

  return <EditorStory defaultPlugin="text" initialState={state} theme={theme} />
})
