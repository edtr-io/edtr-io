import { EditorProps } from '@edtr-io/core'
import { select } from '@storybook/addon-knobs'
import * as R from 'ramda'
import * as React from 'react'

import { plugins } from '../plugins'
import { PlainContainer } from './plain'
import { SerloContainer } from './serlo'
import { SerloWithPreviewContainer } from './serlo-with-preview'

enum Container {
  Plain = 'Plain',
  Serlo = 'Serlo',
  SerloWithPreview = 'SerloWithPreview'
}

const Components = {
  [Container.Plain]: PlainContainer,
  [Container.Serlo]: SerloContainer,
  [Container.SerloWithPreview]: SerloWithPreviewContainer
}

export function EditorStory(props: Partial<EditorProps>) {
  const defaultContainer =
    (localStorage.getItem('storybook.container') as Container) ||
    Container.Serlo
  const container = select('Container', R.values(Container), defaultContainer)
  const Component = Components[container]
  React.useEffect(() => {
    localStorage.setItem('storybook.container', container)
  }, [container])

  return <Component plugins={plugins} defaultPlugin="text" {...props} />
}
