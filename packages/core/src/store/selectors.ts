import * as R from 'ramda'
import { Plugin, State } from '@edtr-io/core'
import { BaseState } from './reducer'
import { isStatelessPlugin, PluginState, PluginType } from '../plugin'

/** Selectors */
export function getRoot(state: State) {
  return state.root
}

export function getDocuments(state: State): Record<string, PluginState> {
  return state.documents
}

export function getDocument(state: State, id: string): PluginState | null {
  return getDocuments(state)[id] || null
}

export function getPlugin(state: State, type: string): Plugin | null {
  const plugins = getPlugins(state)

  return plugins[type] || null
}

export function getClipboard(state: State): PluginState[] {
  return state.clipboard
}

export function getPluginOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): Plugin | null {
  return getPlugin(state, type)
}

export function getDefaultPlugin(state: State): PluginType {
  return state.defaultPlugin
}

export function getPluginTypeOrDefault(
  state: State,
  type = getDefaultPlugin(state)
): PluginType {
  return type
}

export function getPlugins<K extends string = string>(
  state: State
): Record<K, Plugin> {
  return state.plugins
}

export function isFocused(state: State, id: string): boolean {
  return state.focus === id
}

export function isEditable(state: State): boolean {
  return state.editable
}

export function hasPendingChanges(state: State): boolean {
  return state.history.pending !== 0
}
export function pendingChanges(state: State): number {
  return state.history.pending
}

export function hasHistory(state: BaseState | State): state is State {
  return (state as State).history !== undefined
}

export function isEmpty(state: State, id: string): boolean {
  const doc = getDocument(state, id)
  if (!doc) {
    return false
  }

  const plugin = getPlugin(state, doc.plugin)
  if (!plugin || isStatelessPlugin(plugin)) {
    return false
  }

  if (typeof plugin.isEmpty === 'function') {
    return plugin.isEmpty(doc.state)
  }

  const initialState = plugin.state.createInitialState({
    createDocument: () => {}
  })
  return R.equals(doc.state, initialState)
}
