import {
  StateType,
  StateTypeReturnType,
  StateTypeSerializedType,
  StateTypeValueType
} from '@edtr-io/abstract-plugin-state'
import * as React from 'react'

export type Plugin<
  S extends StateType = StateType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props extends Record<string, unknown> = any
> = StatelessPlugin<Props> | StatefulPlugin<S, Props>

export interface StatelessPlugin<Props extends Record<string, unknown> = {}> {
  Component: React.ComponentType<StatelessPluginEditorProps<Props>>
  onPaste?: (data: DataTransfer) => void | { state?: undefined }
  title?: string
  icon?: React.ComponentType
  description?: string
}

export type StatelessPluginEditorProps<Props = {}> = {
  name: string
  editable?: boolean
  focused?: boolean
} & Props

export interface StatefulPlugin<S extends StateType, Props = {}> {
  Component: React.ComponentType<StatefulPluginEditorProps<S, Props>>
  state: S
  onPaste?: (
    data: DataTransfer
  ) => void | { state?: StateTypeSerializedType<S> }
  title?: string
  icon?: React.ComponentType
  description?: string
  isEmpty?: (state: StateTypeValueType<S>) => boolean
  onKeyDown?: (e: KeyboardEvent) => boolean
}

export type StatefulPluginEditorProps<
  S extends StateType = StateType,
  Props = {}
> = StatelessPluginEditorProps<Props> & {
  state: StateTypeReturnType<S>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isStatefulPlugin<S extends StateType>(
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
