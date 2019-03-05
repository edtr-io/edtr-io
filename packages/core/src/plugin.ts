import * as React from 'react'

import { StateDescriptor, StateDescriptorReturnType } from './plugin-state'

export type Plugin<S extends StateDescriptor = StateDescriptor> =
  | StatelessPlugin
  | StatefulPlugin<S>

export interface StatelessPlugin {
  Component: React.ComponentType<StatelessPluginEditorProps>
}

export interface StatelessPluginEditorProps {
  editable?: boolean
  focused?: boolean
}

export interface StatefulPlugin<S extends StateDescriptor> {
  Component: React.ComponentType<StatefulPluginEditorProps<S>>
  state: S
}

export interface StatefulPluginEditorProps<S extends StateDescriptor>
  extends StatelessPluginEditorProps {
  state: StateDescriptorReturnType<S>
}

export function isStatefulPlugin<S extends StateDescriptor>(
  plugin: Plugin<S>
): plugin is StatefulPlugin<S> {
  return typeof (plugin as StatefulPlugin<S>).state !== 'undefined'
}

export function isStatelessPlugin(plugin: Plugin): plugin is StatelessPlugin {
  return !isStatefulPlugin(plugin)
}
