import { SpoilerTheme } from '@edtr-io/plugin-spoiler'
import { CustomTheme } from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory } from '../src'
import { RowTheme } from '@edtr-io/plugin-rows'

storiesOf('Theming', module).add('Custom Theme', () => {
  const state = {
    plugin: 'rows',
    state: [{ plugin: 'text' }]
  }

  /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
  const theme: CustomTheme = {
    editor: {
      color: '#222',
      backgroundColor: '#d9edf7',
      primary: {
        background: '#007ec1'
      }
    },
    editorUi: {
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
        highlightColor: 'black'
      },
      textarea: {
        color: 'red',
        backgroundColor: 'green',
        highlightColor: 'black'
      }
    },
    rendererUi: {
      expandableBox: {
        toggleBorderColor: 'red'
      }
    },
    plugins: {
      spoiler: {
        color: 'red'
      } as SpoilerTheme,
      rows: {
        backgroundColor: 'red',
        color: 'green',
        highlightColor: 'purple',
        lightBackgroundColor: 'pink',
        menu: {
          highlightColor: 'purple',
          primary: {
            backgroundColor: 'red',
            color: 'green'
          },
          secondary: {
            backgroundColor: 'pink',
            color: 'lightgreen'
          }
        }
      } as RowTheme
    }
  }
  /* eslint-enable @typescript-eslint/no-object-literal-type-assertion */

  return <EditorStory defaultPlugin="text" initialState={state} theme={theme} />
})
