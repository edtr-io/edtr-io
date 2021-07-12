/**
 * Defines the Interface for the Edtr.io plugin toolbar (INTERNAL)
 *
 * @remarks
 * This is an internal package. You should use the re-exports defined in
 * {@link @edtr-io/plugin-toolbar# | `@edtr-io/plugin-toolbar`} instead.
 * @packageDocumentation
 */
import * as React from 'react'

/**
 * The props for {@link PluginToolbar | PluginToolbarButton}
 *
 * @beta
 */
export interface PluginToolbarButtonProps {
  className?: string
  icon: React.ReactNode
  label: string
  ref: React.Ref<HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

/**
 * The props for {@link PluginToolbar | PluginToolbarOverlayButton}
 *
 * @beta
 */
export interface PluginToolbarOverlayButtonProps {
  className?: string
  renderContent?(
    children: React.ReactNode,
    additional: { close(): void }
  ): React.ReactNode
  contentRef: React.RefObject<HTMLDivElement>
  icon: React.ReactNode
  label: string
}

/**
 * The props for {@link PluginToolbar | OverlayButton}
 *
 * @beta
 */
export interface OverlayButtonProps {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  label: string
}

/**
 * The props for {@link PluginToolbar | OverlayCheckbox}
 *
 * @beta
 */
export interface OverlayCheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label: string
}

/**
 * The props for {@link PluginToolbar | OverlayInput}
 *
 * @beta
 */
export interface OverlayInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
}

/**
 * The props for {@link PluginToolbar | OverlaySelect}
 *
 * @beta
 */
export interface OverlaySelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string
  options: string[]
  width?: string
}

/**
 * The props for {@link PluginToolbar | OverlayTextarea}
 *
 * @beta
 */
export interface OverlayTextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
}

/**
 * Describes the available components for the plugin toolbar
 *
 * @beta
 */
export interface PluginToolbar {
  OverlayButton: React.ComponentType<OverlayButtonProps>
  OverlayCheckbox: React.ComponentType<OverlayCheckboxProps>
  OverlayInput: React.ComponentType<OverlayInputProps>
  OverlaySelect: React.ComponentType<OverlaySelectProps>
  OverlayTextarea: React.ComponentType<OverlayTextareaProps>
  PluginToolbarButton: React.ComponentType<PluginToolbarButtonProps>
  PluginToolbarOverlayButton: React.ComponentType<PluginToolbarOverlayButtonProps>
}
