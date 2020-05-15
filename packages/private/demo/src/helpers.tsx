import { RendererProps } from '@edtr-io/renderer'
import { storiesOf } from '@storybook/react'
import { startCase } from 'lodash'
import * as R from 'ramda'
import * as React from 'react'

import { EditorStory, RendererStory } from './container'

export function addStory(
  name: string,
  props: {
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

export function addPluginStories({
  name,
  plugin,
  states,
}: {
  plugin: string
  name: string
  states: Record<string, unknown>
}) {
  const storyName = `Plugins/${name}`
  addStory(`${storyName}/Initial State`, {
    state: {
      plugin,
    },
  })
  R.forEachObjIndexed((state, name) => {
    addStory(`${storyName}/${startCase(name)}`, {
      state: {
        plugin,
        state,
      },
    })
  }, states)
}
