import * as React from 'react'

export type Plugin<S = undefined> = StatelessPlugin | StatefulPlugin<S>

export interface StatelessPlugin<PluginState = undefined> {
  Component: React.ComponentType<PluginEditorProps<PluginState>>
}

export interface StatefulPlugin<PluginState = undefined>
  extends StatelessPlugin<PluginState> {
  createInitialState: () => PluginState
}

export interface SerializablePlugin<PluginState, SerializedState>
  extends StatefulPlugin<PluginState> {
  serialize: (state: PluginState) => SerializedState
  deserialize: (serializedState: SerializedState) => PluginState
}

export interface PluginEditorProps<PluginState = undefined> {
  state: PluginState
  onChange: (state: Partial<PluginState>) => void
  editable?: boolean
  focused?: boolean
}

export function isSerializablePlugin<S = undefined, T = undefined>(
  plugin: Plugin<S>
): plugin is SerializablePlugin<S, T> {
  return typeof (plugin as SerializablePlugin<S, T>).serialize !== 'undefined'
}

export function isStatefulPlugin<S = undefined>(
  plugin: Plugin<S>
): plugin is StatefulPlugin<S> {
  return typeof (plugin as StatefulPlugin<S>).createInitialState !== 'undefined'
}

export function isStatelessPlugin<S = undefined>(
  plugin: Plugin<S>
): plugin is StatelessPlugin {
  return !isStatefulPlugin(plugin)
}
