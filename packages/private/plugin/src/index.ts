import {
  StateType,
  StateTypeReturnType,
  StateTypeSerializedType,
  StateTypeValueType
} from '@edtr-io/internal__plugin-state'
import { Theme } from '@edtr-io/ui'
import * as React from 'react'

/**
 * An Edtr.io plugin
 *
 * @public
 */
export interface EditorPlugin<
  S extends StateType = StateType,
  Config extends {} = {}
> {
  /**
   * React component that will be used to render the plugin. It accepts [[PluginEditorProps]] and `Props`.
   */
  Component: React.ComponentType<EditorPluginProps<S, Config>>

  /**
   * Plugin configuration
   */
  config: Config | ((theme: Theme) => Config)

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
   * @returns `true` if the plugin is empty
   */
  isEmpty?(state: StateTypeValueType<S>): boolean
}

/**
 * Props for the component of an [[EditorPlugin]]
 *
 * @public
 */
export interface EditorPluginProps<
  S extends StateType = StateType,
  Config extends {} = {}
> {
  /**
   * Plugin configuration
   */
  config: Config

  /**
   * Current state of the document, see {@link @edtr-io/internal__plugin-state#StateTypeReturnType}
   */
  state: StateTypeReturnType<S>

  /**
   * ID of the document
   */
  id: string

  /**
   * Name of the plugin as defined in the registry
   *
   * @deprecated Will be removed as soon as we found a better solution for that
   */
  name: string

  /**
   * `true` if the document is currently editable
   */
  editable: boolean

  /**
   * `true` if the document is currently focused
   */
  focused: boolean

  /**
   * Ref to use for an input element. The element will receive focus, when the plugin is focused.
   */
  defaultFocusRef: React.RefObject<HTMLInputElement & HTMLTextAreaElement>

  /**
   * Allows the plugin to render into the plugin settings
   *
   * @param children - content to render
   */
  renderIntoSettings(children: React.ReactNode): React.ReactNode

  /**
   * Allows the plugin to render buttons into the toolbar
   *
   * @param children - buttons to render
   */
  renderIntoToolbar(children: React.ReactNode): React.ReactNode
}
