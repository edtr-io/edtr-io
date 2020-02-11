import { PluginToolbar } from '@edtr-io/internal__plugin-toolbar'
import * as React from 'react'

/**
 * Allows to override the default rendering behavior of the document editor
 *
 * @beta
 */
export interface DocumentEditorProps {
  /**
   * The rendered document
   */
  children: React.ReactNode

  /**
   * The rendered settings
   */
  settingsRef: React.RefObject<HTMLDivElement>

  /**
   * The rendered toolbar buttons
   */
  toolbarRef: React.RefObject<HTMLDivElement>

  /**
   * `true` if the document has rendered any settings
   */
  hasSettings: boolean

  /**
   * `true` if the document has rendered any toolbar buttons
   */
  hasToolbar: boolean

  /**
   * Render prop to override rendering of settings
   *
   * @param children - the rendered settings
   * @returns the newly rendered settings
   */
  renderSettings?(
    children: React.ReactNode,
    { close }: { close(): void }
  ): React.ReactNode

  /**
   * Render prop to override rendering of toolbar
   *
   * @param children - the rendered settings
   * @returns the newly rendered settings
   */
  renderToolbar?(children: React.ReactNode): React.ReactNode

  /**
   * `true` if the document is focused
   */
  focused: boolean

  PluginToolbar: PluginToolbar
}
