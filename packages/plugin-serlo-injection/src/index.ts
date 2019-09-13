import { legacyString, StatefulPlugin } from '@edtr-io/plugin'

import { SerloInjectionEditor } from './editor'

export const serloInjectionState = legacyString()

export const serloInjectionPlugin: StatefulPlugin<
  typeof serloInjectionState
> = {
  Component: SerloInjectionEditor,
  state: serloInjectionState,
  title: 'Serlo Inhalt',
  description: 'Binde einen Inhalt von serlo.org via ID ein'
}
