import { EditorProps } from '@edtr-io/core'
import { RendererProps } from '@edtr-io/renderer'
import { action } from '@storybook/addon-actions'
import { select } from '@storybook/addon-knobs'
import * as R from 'ramda'
import * as React from 'react'

import { plugins } from '../plugins'
import { PlainEditorContainer, PlainRendererContainer } from './plain'
import { SerloEditorContainer, SerloRendererContainer } from './serlo'
import {
  SerloWithPreviewEditorContainer,
  SerloWithPreviewRendererContainer
} from './serlo-with-preview'

enum Container {
  Plain = 'Plain',
  Serlo = 'Serlo',
  SerloWithPreview = 'SerloWithPreview'
}

const Components: Record<
  Container,
  {
    Editor: React.ComponentType<EditorProps>
    Renderer: React.ComponentType<RendererProps>
  }
> = {
  [Container.Plain]: {
    Editor: PlainEditorContainer,
    Renderer: PlainRendererContainer
  },
  [Container.Serlo]: {
    Editor: SerloEditorContainer,
    Renderer: SerloRendererContainer
  },
  [Container.SerloWithPreview]: {
    Editor: SerloWithPreviewEditorContainer,
    Renderer: SerloWithPreviewRendererContainer
  }
}

export function EditorStory(props: Partial<EditorProps>) {
  const defaultContainer =
    (localStorage.getItem('storybook.container') as Container) ||
    Container.Serlo
  const container = select('Container', R.values(Container), defaultContainer)
  const Component = Components[container].Editor
  React.useEffect(() => {
    localStorage.setItem('storybook.container', container)
  }, [container])

  return (
    <Component
      plugins={plugins}
      defaultPlugin="text"
      onError={action('onError')}
      {...props}
    />
  )
}

export function RendererStory(props: Pick<RendererProps, 'state' | 'theme'>) {
  const defaultContainer =
    (localStorage.getItem('storybook.container') as Container) ||
    Container.Serlo
  const container = select('Container', R.values(Container), defaultContainer)
  const Component = Components[container].Renderer
  React.useEffect(() => {
    localStorage.setItem('storybook.container', container)
  }, [container])

  return <Component plugins={plugins} {...props} />
}
