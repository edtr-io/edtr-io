import { Plugin } from '@edtr-io/abstract-plugin'

import { createSubReducer } from '../helpers'
import { ScopedState } from '../types'

export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

export function getDefaultPlugin(state: ScopedState) {
  return state.plugins.defaultPlugin
}

export function getPlugins(state: ScopedState) {
  return state.plugins.plugins
}

export function getPlugin(state: ScopedState, type: string): Plugin | null {
  const plugins = getPlugins(state)
  return plugins[type] || null
}

export function getPluginTypeOrDefault(
  state: ScopedState,
  type = getDefaultPlugin(state)
): string {
  return type
}

export function getPluginOrDefault(
  state: ScopedState,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}
