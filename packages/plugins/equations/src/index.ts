import {
  child,
  list,
  object,
  EditorPlugin,
  EditorPluginProps,
  string
} from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { EquationsEditor } from './editor'
import * as Guideline from './guideline-texts'

export { textPlugin }

interface Component {
  options: Parameters<typeof child>
  label: string
}
export interface EquationsConfig {
  left: Component
  right: Component
  transform: Component
}

export function createEquationsPlugin({
  left = { options: [{ plugin: textPlugin }], label: Guideline.leftsideLabel },
  right = {
    options: [{ plugin: textPlugin }],
    label: Guideline.rightsideLabel
  },
  transform = {
    options: [{ plugin: textPlugin }],
    label: Guideline.transformLabel
  }
}: {
  left?: Component
  right?: Component
  transform?: Component
} = {}): EditorPlugin<EquationsState, EquationsConfig> {
  return {
    Component: EquationsEditor,
    config: { left, right, transform },
    state: createEquationsState(left.options, right.options, transform.options)
  }
}

function createEquationsState(
  left: Parameters<typeof child>,
  right: Parameters<typeof child>,
  transform: Parameters<typeof child>
) {
  const StepProps = object({
    left: child(...left),
    symbol: string('equals'),
    right: child(...right),
    transform: child(...transform)
  })

  return object({
    steps: list(StepProps)
  })
}
export type EquationsState = ReturnType<typeof createEquationsState>
export type EquationsProps = EditorPluginProps<EquationsState, EquationsConfig>
