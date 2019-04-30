import { EquationsEditor } from './editor'
import { StateType, StatefulPlugin } from '@edtr-io/core'
import { createIcon, faEquals } from '@edtr-io/editor-ui'

export const StepProps = StateType.object({
  left: StateType.child(),
  right: StateType.child(),
  transform: StateType.child()
})

export const equationsState = StateType.object({
  steps: StateType.list(StepProps)
})

export const equationsPlugin: StatefulPlugin<typeof equationsState> = {
  Component: EquationsEditor,
  state: equationsState,
  title: 'Gleichungen',
  description: 'Erzeuge einfach übersichtliche mathematische Gleichungen.',
  icon: createIcon(faEquals)
}

export * from './editor'
