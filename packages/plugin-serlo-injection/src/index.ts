import { createIcon, faNewspaper } from '@edtr-io/editor-ui'
import { StatefulPlugin, string } from '@edtr-io/plugin'

import { SerloInjectionEditor } from './editor'

export const serloInjectionState = string()

export const serloInjectionPlugin: StatefulPlugin<
  typeof serloInjectionState
> = {
  Component: SerloInjectionEditor,
  state: serloInjectionState,
  title: 'Serlo Inhalt',
  description: 'Binde einen Inhalt von serlo.org via ID ein',
  icon: createIcon(faNewspaper)
}
