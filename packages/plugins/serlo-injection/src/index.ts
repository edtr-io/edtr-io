import { Plugin, string } from '@edtr-io/plugin'
import { createIcon, faNewspaper } from '@edtr-io/ui'

import { SerloInjectionEditor } from './editor'

export const serloInjectionState = string()

export const serloInjectionPlugin: Plugin<typeof serloInjectionState> = {
  Component: SerloInjectionEditor,
  state: serloInjectionState,
  title: 'Serlo Inhalt',
  description: 'Binde einen Inhalt von serlo.org via ID ein',
  icon: createIcon(faNewspaper)
}
