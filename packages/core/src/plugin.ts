import * as React from 'react'

import {
  StateDescriptor,
  StateDescriptorReturnType,
  StateDescriptorSerializedType
} from './plugin-state'

export type Plugin<
  S extends StateDescriptor = StateDescriptor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props extends Record<string, unknown> = any
> = StatelessPlugin<Props> | StatefulPlugin<S, Props>

export interface StatelessPlugin<Props extends Record<string, unknown> = {}> {
  Component: React.ComponentType<StatelessPluginEditorProps<Props>>
  onPaste?: (data: DataTransfer) => void | { state?: undefined }
}

export type StatelessPluginEditorProps<
  Props extends Record<string, unknown> = {}
> = {
  editable?: boolean
  focused?: boolean
} & Props

export interface StatefulPlugin<
  S extends StateDescriptor,
  Props extends Record<string, unknown> = {}
> {
  Component: React.ComponentType<StatefulPluginEditorProps<S, Props>>
  state: S
  onPaste?: (
    data: DataTransfer
  ) => void | { state?: StateDescriptorSerializedType<S> }
  onKeyDown?: (e: KeyboardEvent) => boolean
  getFocusableChildren?: (
    state: StateDescriptorReturnType<S>
  ) => { id: string }[]
}

export type StatefulPluginEditorProps<
  S extends StateDescriptor = StateDescriptor,
  Props extends Record<string, unknown> = {}
> = StatelessPluginEditorProps<Props> & {
  state: StateDescriptorReturnType<S>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isStatefulPlugin<S extends StateDescriptor>(
  plugin: Plugin<S>
): plugin is StatefulPlugin<S, any> {
  return typeof (plugin as StatefulPlugin<S, any>).state !== 'undefined'
}

export function isStatelessPlugin(
  plugin: Plugin
): plugin is StatelessPlugin<any> {
  return !isStatefulPlugin(plugin)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
