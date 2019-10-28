import { StatefulPlugin, string } from '@edtr-io/plugin'
import { createIcon, faNewspaper } from '@edtr-io/ui'

import { SerloInjectionEditor } from './editor'

export const serloInjectionState = string()

export function createSerloInjectionPlugin(): StatefulPlugin<
  typeof serloInjectionState
> {
  return {
    Component: SerloInjectionEditor,
    config: {},
    state: serloInjectionState,
    title: 'Serlo Inhalt',
    description: 'Binde einen Inhalt von serlo.org via ID ein',
    icon: createIcon(faNewspaper)
  }
}
