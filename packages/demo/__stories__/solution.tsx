import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { textPlugin } from '@edtr-io/plugin-text'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

const plugins: Record<string, Plugin<any>> = {
  solution: solutionPlugin,
  text: textPlugin
}

storiesOf('HintPlugin', module).add('Empty example', () => {
  const state = createDocument({
    plugin: 'solution'
  })
  return <Editor plugins={plugins} defaultPlugin="text" state={state} />
})
