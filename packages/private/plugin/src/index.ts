import {
  StateType,
  StateTypeReturnType,
  StateTypeSerializedType,
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
  // eslint-disable-next-line @typescript-eslint/ban-types
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
   * May be provided to let the plugin respond to text [`paste` events](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   * or drop events
   *
   * @param text - The pasted text
   */
  onText?(text: string): void | { state?: StateTypeSerializedType<S> }

  /**
   * May be provided to let the plugin respond to file [`paste` events](https://developer.mozilla.org/docs/Web/API/Element/paste_event)
   * or drop events
   *
   * @param files - The [FileList](https://developer.mozilla.org/en-US/docs/Web/API/FileList)
   */
  onFiles?(files: File[]): void | { state?: StateTypeSerializedType<S> }

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
  isEmpty?(state: StateTypeReturnType<S>): boolean

  /**
   * May be provided if the plugin is able to insert additional children
   *
   * @param state - The current state
   * @param previousSibling - The id of the child after the new document should be inserted (or `undefined` if the document should be inserted at the front)
   * @param document - The document to insert
   */
  insertChild?(
    state: StateTypeReturnType<S>,
    {
      previousSibling,
      document,
    }: {
      previousSibling?: string
      document?: { plugin: string; state?: unknown }
    }
  ): void

  /**
   * May be provided if the plugin is able to remove its child
   *
   * @param state - The current state
   * @param id - The id of the child that should be removed
   */
  removeChild?(state: StateTypeReturnType<S>, id: string): void
}

/**
 * Props for the component of an [[EditorPlugin]]
 *
 * @public
 */
export interface EditorPluginProps<
  S extends StateType = StateType,
  // eslint-disable-next-line @typescript-eslint/ban-types
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
  autofocusRef: React.RefObject<HTMLInputElement & HTMLTextAreaElement>

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
