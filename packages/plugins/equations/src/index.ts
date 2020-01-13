import {
  child,
  list,
  object,
  EditorPlugin,
  EditorPluginProps
} from '@edtr-io/plugin'

import { EquationsEditor } from './editor'

/** @public */
export function createEquationsPlugin({
  left = [],
  right = [],
  transform = []
}: {
  left?: Parameters<typeof child>
  right?: Parameters<typeof child>
  transform?: Parameters<typeof child>
} = {}): EditorPlugin<EquationsState> {
  return {
    Component: EquationsEditor,
    config: {},
    state: createEquationsState(left, right, transform)
  }
}

/** @public */
export function createEquationsState(
  left: Parameters<typeof child>,
  right: Parameters<typeof child>,
  transform: Parameters<typeof child>
) {
  const StepProps = object({
    left: child(...left),
    right: child(...right),
    transform: child(...transform)
  })

  return object({
    steps: list(StepProps)
  })
}
/** @public */
export type EquationsState = ReturnType<typeof createEquationsState>
/** @public */
export type EquationsProps = EditorPluginProps<EquationsState>
