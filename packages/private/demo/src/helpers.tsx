import { EditorProps } from '@edtr-io/core'
import { RendererProps } from '@edtr-io/renderer'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { EditorStory, RendererStory } from './container'

export function addStory(
  name: string,
  props: {
    defaultPlugin?: EditorProps['defaultPlugin']
    theme?: RendererProps['theme']
    state: RendererProps['state']
  }
) {
  const stories = storiesOf(name, module)
  stories.add('Editor', () => {
    return <EditorStory initialState={props.state} {...props} />
  })
  stories.add('Renderer', () => {
    return <RendererStory {...props} />
  })
}
