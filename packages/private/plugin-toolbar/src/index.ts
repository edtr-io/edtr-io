import * as React from 'react'

/** @public */
export interface PluginToolbarButtonProps {
  className?: string
  icon: React.ReactNode
  label: string
  ref: React.Ref<HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

/** @public */
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

/** @public */
export interface OverlayButtonProps {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  label: string
}

/** @public */
export interface OverlayCheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label: string
}

/** @public */
export interface OverlayInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
}

/** @public */
export interface OverlaySelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string
  options: string[]
  width?: string
}

/** @public */
export interface OverlayTextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
}

/** @public */
export interface PluginToolbar {
  OverlayButton: React.ComponentType<OverlayButtonProps>
  OverlayCheckbox: React.ComponentType<OverlayCheckboxProps>
  OverlayInput: React.ComponentType<OverlayInputProps>
  OverlaySelect: React.ComponentType<OverlaySelectProps>
  OverlayTextarea: React.ComponentType<OverlayTextareaProps>
  PluginToolbarButton: React.ComponentType<PluginToolbarButtonProps>
  PluginToolbarOverlayButton: React.ComponentType<
    PluginToolbarOverlayButtonProps
  >
}
