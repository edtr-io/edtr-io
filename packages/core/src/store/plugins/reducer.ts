import { Plugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { ScopeState } from '../types'

export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

export function getDefaultPlugin(state: ScopeState) {
  return state.plugins.defaultPlugin
}

export function getPlugins(state: ScopeState) {
  return state.plugins.plugins
}

export function getPlugin(state: ScopeState, type: string): Plugin | null {
  const plugins = getPlugins(state)
  return plugins[type] || null
}

export function getPluginTypeOrDefault(
  state: ScopeState,
  type = getDefaultPlugin(state)
): string {
  return type
}

export function getPluginOrDefault(
  state: ScopeState,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}

export const publicPluginsSelectors = {
  getDefaultPlugin,
  getPlugins,
  getPlugin
}
