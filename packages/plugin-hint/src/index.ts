import { StatefulPlugin, StateType } from '@edtr-io/core'

import { HintEditor } from './editor'
import { createIcon, faLightbulb } from '@edtr-io/editor-ui'

export const hintState = StateType.object({
  title: StateType.string(''),
  content: StateType.child()
})

export const hintPlugin: StatefulPlugin<typeof hintState> = {
  Component: HintEditor,
  state: hintState,
  icon: createIcon(faLightbulb)
}
