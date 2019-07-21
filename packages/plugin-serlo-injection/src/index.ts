import { StatefulPlugin, StateType } from '@edtr-io/core'

import { SerloInjectionEditor } from './editor'

export const injectionState = StateType.string()

export const serloInjectionPlugin: StatefulPlugin<typeof injectionState> = {
  Component: SerloInjectionEditor,
  state: injectionState,
  title: 'Serlo Inhalt',
  description: 'Binde einen Inhalt von serlo.org via ID ein'
}
