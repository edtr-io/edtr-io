import { Plugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { EditorState } from '../types'

export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

export function getDefaultPlugin(state: EditorState) {
  return state.plugins.defaultPlugin
}

export function getPlugins(state: EditorState) {
  return state.plugins.plugins
}

export function getPlugin(state: EditorState, type: string): Plugin | null {
  const plugins = getPlugins(state)
  return plugins[type] || null
}

export function getPluginTypeOrDefault(
  state: EditorState,
  type = getDefaultPlugin(state)
): string {
  return type
}

export function getPluginOrDefault(
  state: EditorState,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}

export const publicPluginsSelectors = {
  getDefaultPlugin,
  getPlugins,
  getPlugin
}
