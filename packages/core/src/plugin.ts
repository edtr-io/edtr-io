import * as React from 'react'

import {
  PluginStateDescriptorReturnType,
  PluginStateParameters
} from './plugin-state'

export type Plugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends (...args: PluginStateParameters<any>) => any = () => void
> = StatelessPlugin | StatefulPlugin<S>

export interface StatelessPlugin {
  Component: React.ComponentType<StatelessPluginEditorProps>
}

export interface StatefulPlugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends (...args: PluginStateParameters<any>) => any
> {
  Component: React.ComponentType<StatefulPluginEditorProps<S>>
  state: S
}

export interface StatefulPluginEditorProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends (...args: PluginStateParameters<any>) => any
> extends StatelessPluginEditorProps {
  state: PluginStateDescriptorReturnType<S>
}

export interface StatelessPluginEditorProps {
  editable?: boolean
  focused?: boolean
}

export function isStatefulPlugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends (...args: PluginStateParameters<any>) => any = () => void
>(plugin: Plugin<S>): plugin is StatefulPlugin<S> {
  return typeof (plugin as StatefulPlugin<S>).state !== 'undefined'
}

export function isStatelessPlugin<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends (...args: PluginStateParameters<any>) => any = () => void
>(plugin: Plugin<S>): plugin is StatelessPlugin {
  return !isStatefulPlugin(plugin)
}
