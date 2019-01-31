import * as React from 'react'

export type Plugin<S = undefined> = StatelessPlugin | StatefulPlugin<S>

export interface StatelessPlugin<PluginState = undefined> {
  Component: React.ComponentType<PluginEditorProps<PluginState>>
}

export interface StatefulPlugin<PluginState = undefined>
  extends StatelessPlugin<PluginState> {
  createInitialState: () => PluginState
}

export interface PluginEditorProps<PluginState = undefined> {
  state: PluginState
  onChange: (state: Partial<PluginState>) => void
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
