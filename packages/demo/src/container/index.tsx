import { Editor, EditorConnectorProps } from '@edtr-io/core'
import { select } from '@storybook/addon-knobs'
import * as R from 'ramda'
import * as React from 'react'

import { plugins } from '../plugins'
import { PlainContainer } from './plain'
import { SerloContainer } from './serlo'

enum Container {
  Plain = 'Plain',
  Serlo = 'Serlo'
}

const Components = {
  [Container.Plain]: PlainContainer,
  [Container.Serlo]: SerloContainer
}

export function EditorStory(props: {
  defaultPlugin?: string
  initialState: EditorConnectorProps['initialState']
}) {
  const defaultContainer =
    (localStorage.getItem('storybook.container') as Container) ||
    Container.Plain
  const container = select('Container', R.values(Container), defaultContainer)
  React.useEffect(() => {
    localStorage.setItem('storybook.container', container)
  }, [container])
  const Component = Components[container]

  return (
    <Editor
      plugins={plugins}
      defaultPlugin={props.defaultPlugin || 'text'}
      initialState={props.initialState}
    >
      {document => {
        return <Component>{document}</Component>
      }}
    </Editor>
  )
}
