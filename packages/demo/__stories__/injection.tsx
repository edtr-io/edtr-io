import { createDocument, Editor, Plugin } from '@edtr-io/core'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { injectionPlugin } from '@edtr-io/plugin-injection'

const plugins: Record<string, Plugin<any>> = {
  injection: injectionPlugin
}

storiesOf('InjectionPlugin', module).add('Empty example', () => {
  const state = createDocument({
    plugin: 'injection'
  })
  return <Editor plugins={plugins} defaultPlugin="injection" state={state} />
})
