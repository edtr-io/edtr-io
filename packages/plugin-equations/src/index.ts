import { createIcon, faEquals } from '@edtr-io/editor-ui'
import { legacyChild, legacyList, object, StatefulPlugin } from '@edtr-io/plugin'

import { EquationsEditor } from './editor'

export const StepProps = object({
  left: legacyChild(),
  right: legacyChild(),
  transform: legacyChild()
})

export const equationsState = object({
  steps: legacyList(StepProps)
})

export const equationsPlugin: StatefulPlugin<typeof equationsState> = {
  Component: EquationsEditor,
  state: equationsState,
  title: 'Gleichungen',
  description: 'Erzeuge einfach übersichtliche mathematische Gleichungen.',
  icon: createIcon(faEquals),
  getFocusableChildren(state) {
    return state()
      .steps()
      .reduce(
        (children, step) => {
          return [...children, step().left, step().right, step().transform]
        },
        [] as { id: string }[]
      )
  }
}

export * from './editor'
