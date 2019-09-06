import { StatefulPlugin, StateType } from '@edtr-io/core'
import { createIcon, faPhotoVideo } from '@edtr-io/editor-ui'

import { createMultimediaExplanationEditor } from './editor'
import * as React from 'react'

export const multimediaExplanationState = StateType.object({
  explanation: StateType.child('rows'),
  multimedia: StateType.child(),
  illustrating: StateType.boolean(true),
  initialized: StateType.boolean(false)
})

export const createMultimediaExplanationPlugin = (multimediaPlugins: PluginRegistry) : StatefulPlugin<typeof multimediaExplanationState> => {
  return {
    Component: createMultimediaExplanationEditor(multimediaPlugins),
    state: multimediaExplanationState,
    icon: createIcon(faPhotoVideo),
    title: 'Erklärung mit Multimedia-Inhalt',
    description: 'Erstelle einen veranschaulichenden oder erklärenden Multimedia-Inhalt mit zugehöriger Erklärung.'
  }
}
export type PluginRegistry = {
  name: string
  title?: string
  icon?: React.ComponentType
  description?: string
}[]