import { StoreSerializeHelpers } from '../plugin-state'
import { isStatelessPlugin, PluginState } from '../plugin'
import { getDocument, State } from '@edtr-io/core'
import { getPlugin, getRoot } from './selectors'

export function serializePlugin(state: State, id: string): PluginState | null {
  const document = getDocument(state, id)

  if (!document) {
    return null
  }

  const plugin = getPlugin(state, document.plugin)

  if (!plugin) {
    return null
  }

  const serializeHelpers: StoreSerializeHelpers = {
    getDocument: (id: string) => serializePlugin(state, id)
  }
  return {
    plugin: document.plugin,
    ...(isStatelessPlugin(plugin)
      ? {}
      : { state: plugin.state.serialize(document.state, serializeHelpers) })
  }
}

export function serializeDocument(state: State): PluginState | null {
  const root = getRoot(state)

  return root ? serializePlugin(state, root) : null
}
