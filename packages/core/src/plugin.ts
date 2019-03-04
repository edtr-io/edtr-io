import * as React from 'react'

import { StateDescriptor, StateDescriptorReturnType } from './plugin-state'

export type Plugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends StateDescriptor<any> = StateDescriptor<any>
> = StatelessPlugin | StatefulPlugin<S>

export interface StatelessPlugin {
  Component: React.ComponentType<StatelessPluginEditorProps>
}

export interface StatelessPluginEditorProps {
  editable?: boolean
  focused?: boolean
}

export interface StatefulPlugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends StateDescriptor<any>
> {
  Component: React.ComponentType<StatefulPluginEditorProps<S>>
  state: S
}

export interface StatefulPluginEditorProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends StateDescriptor<any>
> extends StatelessPluginEditorProps {
  state: StateDescriptorReturnType<S>
}

export function isStatefulPlugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends StateDescriptor<any>
>(plugin: Plugin<S>): plugin is StatefulPlugin<S> {
  return typeof (plugin as StatefulPlugin<S>).state !== 'undefined'
}

export function isStatelessPlugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends StateDescriptor<any>
>(plugin: Plugin<S>): plugin is StatelessPlugin {
  return !isStatefulPlugin(plugin)
}
