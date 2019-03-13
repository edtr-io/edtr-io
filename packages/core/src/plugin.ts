import * as React from 'react'

import {
  StateDescriptor,
  StateDescriptorReturnType,
  StateDescriptorSerializedType
} from './plugin-state'

export type Plugin<S extends StateDescriptor = StateDescriptor> =
  | StatelessPlugin
  | StatefulPlugin<S>

export interface StatelessPlugin {
  Component: React.ComponentType<StatelessPluginEditorProps>
  onPaste?: (data: DataTransfer) => void | { state?: undefined }
}

export interface StatelessPluginEditorProps {
  editable?: boolean
  focused?: boolean
}

export interface StatefulPlugin<S extends StateDescriptor> {
  Component: React.ComponentType<StatefulPluginEditorProps<S>>
  state: S
  onPaste?: (
    data: DataTransfer
  ) => void | { state?: StateDescriptorSerializedType<S> }
}

export interface StatefulPluginEditorProps<
  S extends StateDescriptor = StateDescriptor
> extends StatelessPluginEditorProps {
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
