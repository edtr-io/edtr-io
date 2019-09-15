/**
 * @module @edtr-io/plugin
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  StateType,
  StateTypeReturnType,
  StateTypeSerializedType,
  StateTypeValueType
} from '@edtr-io/abstract-plugin-state'
import * as React from 'react'

/**
 * An Edtr.io plugin is either a [[StatelessPlugin]] or a [[StatefulPlugin]]
 *
 * @typeparam S the state type of the Plugin (only used when the plugin is stateful)
 * @typeparam Props additional props that the plugin component accepts
 */
export type Plugin<
  S extends StateType = StateType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Props = any
> = StatelessPlugin<Props> | StatefulPlugin<S, Props>

/**
 * An Edtr.io plugin without state
 *
 * @typeparam Props additional props that the plugin component accepts
 */
export interface StatelessPlugin<Props = {}> {
  /**
   * React component that will be used to render the plugin. It accepts [[StatelessPluginEditorProps]] and `Props`..
   */
  Component: React.ComponentType<StatelessPluginEditorProps & Props>

  /**
   * May be provided to let the plugin respond to [`paste` events](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   *
   * @param data - the [DataTransfer](https://developer.mozilla.orgdocs/Web/API/DataTransfer) object of the corresponding [`paste` event](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   * @returns an empty object if you want to handle the [`paste` event](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   */
  onPaste?(data: DataTransfer): void | { state?: undefined }

  /**
   * Deprecated plugin meta data
   *
   * @deprecated
   */
  title?: string
  /**
   * Deprecated plugin meta data
   *
   * @deprecated
   */
  icon?: React.ComponentType
  /**
   * Deprecated plugin meta data
   *
   * @deprecated
   */
  description?: string
}

/**
 * Props for the component of a [[StatelessPlugin]]
 */
export interface StatelessPluginEditorProps {
  /**
   * Name of the plugin as defined in the registry. Will be removed as soon as we found a better solution for that
   *
   * @deprecated
   */
  name: string

  /**
   * `true` if the plugin should be editable
   */
  editable?: boolean

  /**
   * `true` if the plugin is currently focused
   */
  focused?: boolean
}

/**
 * An Edtr.io plugin with state
 *
 * @typeparam S [[StateType]] of the plugin
 */
export interface StatefulPlugin<S extends StateType, Props = {}> {
  /**
   * React component that will be used to render the plugin. It accepts [[StatelessPluginEditorProps]] and `Props`..
   */
  Component: React.ComponentType<StatefulPluginEditorProps<S> & Props>

  /**
   * [[StateType]] of the plugin
   */
  state: S

  /**
   * May be provided to let the plugin respond to [`paste` events](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   *
   * @param data - the [DataTransfer](https://developer.mozilla.orgdocs/Web/API/DataTransfer) object of the corresponding [`paste` event](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   * @returns an object optionally containing the serialized state of the document to insert if you want to handle the [`paste` event](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   */
  onPaste?(data: DataTransfer): void | { state?: StateTypeSerializedType<S> }

  /**
   * May be provided to prevent the default Edtr.io keyboard shortcuts
   *
   * @param e - the [KeyboardEvent](https://developer.mozilla.org/docs/Web/API/KeyboardEvent)
   * @returns `false` if the keyboard shortcut should be prevented
   */
  onKeyDown?(e: KeyboardEvent): boolean

  /**
   * Will be used to decide if the plugin is empty (e.g. to decide whether we can safely delete the plugin). If not provided, we consider a plugin empty iff its state equals its initial state.
   *
   * @param state - the current state
   * @returns `true` iff the plugin is empty
   */
  isEmpty?(state: StateTypeValueType<S>): boolean

  /**
   * Deprecated plugin meta data
   *
   * @deprecated
   */
  title?: string
  /**
   * Deprecated plugin meta data
   *
   * @deprecated
   */
  icon?: React.ComponentType
  /**
   * Deprecated plugin meta data
   *
   * @deprecated
   */
  description?: string
}

/**
 * Props for the component of a [[StatefulPlugin]]
 *
 * @typeparam S [[StateType]] of the plugin
 */
export interface StatefulPluginEditorProps<S extends StateType = StateType>
  extends StatelessPluginEditorProps {
  /**
   * Current state of the plugin
   *
   * @see [[StateTypeReturnType]]
   */
  state: StateTypeReturnType<S>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * [Type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types) that checks whether the given [[Plugin]] is stateful
 *
 * @param plugin
 * @typeparam S the [[StateType]] to assert
 * @returns `true` if the plugin is stateful
 */
export function isStatefulPlugin<S extends StateType>(
  plugin: Plugin<S>
): plugin is StatefulPlugin<S, any> {
  return typeof (plugin as StatefulPlugin<S, any>).state !== 'undefined'
}

/**
 * [Type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types) that checks whether the given [[Plugin]] is stateless
 *
 * @param plugin
 * @returns `true` if the plugin is stateless
 */
export function isStatelessPlugin(
  plugin: Plugin
): plugin is StatelessPlugin<any> {
  return !isStatefulPlugin(plugin)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
