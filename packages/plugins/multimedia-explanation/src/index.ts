import {
  boolean,
  child,
  number,
  object,
  DeprecatedPlugin
} from '@edtr-io/plugin'
import { createIcon, faPhotoVideo } from '@edtr-io/ui'
import * as React from 'react'

import { createMultimediaExplanationEditor } from './editor'

export const multimediaExplanationState = (multimediaPlugins: PluginRegistry) =>
  object({
    explanation: child({ plugin: 'rows' }),
    multimedia: child({ plugin: multimediaPlugins[0].name }),
    illustrating: boolean(true),
    width: number(50) //percent
  })

export type MultimediaExplanationState = ReturnType<
  typeof multimediaExplanationState
>

export const createMultimediaExplanationPlugin = (
  multimediaPlugins: PluginRegistry
): DeprecatedPlugin<MultimediaExplanationState> => {
  return {
    Component: createMultimediaExplanationEditor(multimediaPlugins),
    state: multimediaExplanationState(multimediaPlugins),
    icon: createIcon(faPhotoVideo),
    title: 'Erklärung mit Multimedia-Inhalt',
    description:
      'Erstelle einen veranschaulichenden oder erklärenden Multimedia-Inhalt mit zugehöriger Erklärung.'
  }
}
export type PluginRegistry = {
  name: string
  title?: string
  icon?: React.ComponentType
  description?: string
}[]
