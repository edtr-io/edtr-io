import { Plugin } from '../../plugin'
import { createSubReducer } from '../helpers'
import { EditorState, StoreState } from '../types'

export const pluginsReducer = createSubReducer(
  'plugins',
  { defaultPlugin: '', plugins: {} },
  {}
)

export function publicGetDefaultPlugin(state: EditorState) {
  return state.plugins.defaultPlugin
}

export function publicGetPlugins(state: EditorState) {
  return state.plugins.plugins
}

export function publicGetPlugin(
  state: EditorState,
  type: string
): Plugin | null {
  const plugins = publicGetPlugins(state)
  return plugins[type] || null
}

export function getDefaultPlugin(state: StoreState, scope: string) {
  return publicGetDefaultPlugin(state[scope])
}

export function getPlugins(state: StoreState, scope: string) {
  return publicGetPlugins(state[scope])
}

export function getPlugin(
  state: StoreState,
  scope: string,
  type = getDefaultPlugin(state, scope)
): Plugin | null {
  return publicGetPlugin(state[scope], type)
}

export function getPluginTypeOrDefault(
  state: StoreState,
  scope: string,
  type = getDefaultPlugin(state, scope)
): string {
  return type
}

export function getPluginOrDefault(
  state: StoreState,
  scope: string,
  type = getDefaultPlugin(state, scope)
): Plugin | null {
  return publicGetPlugin(state[scope], type)
}

export const publicPluginsSelectors = {
  getDefaultPlugin: publicGetDefaultPlugin,
  getPlugins: publicGetPlugins,
  getPlugin: publicGetPlugin
}
