import { child, list, object, StatefulPlugin } from '@edtr-io/plugin'
import { createIcon, faEquals } from '@edtr-io/ui'

import { EquationsEditor } from './editor'

function createEquationsState(
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

export type EquationsPluginState = ReturnType<typeof createEquationsState>

export function createEquationsPlugin({
  left = [],
  right = [],
  transform = []
}: {
  left?: Parameters<typeof child>
  right?: Parameters<typeof child>
  transform?: Parameters<typeof child>
} = {}): StatefulPlugin<EquationsPluginState> {
  return {
    Component: EquationsEditor,
    config: {},
    state: createEquationsState(left, right, transform),
    title: 'Gleichungen',
    description: 'Erzeuge einfach übersichtliche mathematische Gleichungen.',
    icon: createIcon(faEquals)
  }
}

export * from './editor'
