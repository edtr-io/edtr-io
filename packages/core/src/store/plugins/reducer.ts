import { Plugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { State } from '../types'

export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

export function getDefaultPlugin(state: State) {
  return state.plugins.defaultPlugin
}

export function getPlugins(state: State) {
  return state.plugins.plugins
}

export function getPlugin(state: State, type: string): Plugin | null {
  const plugins = getPlugins(state)
  return plugins[type] || null
}

export function getPluginTypeOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): string {
  return type
}

export function getPluginOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}

export const publicPluginsSelectors = {
  getDefaultPlugin,
  getPlugins,
  getPlugin
}
