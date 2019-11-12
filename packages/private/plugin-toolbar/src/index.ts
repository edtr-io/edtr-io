import * as React from 'react'

export interface PluginToolbarButtonProps {
  className?: string
  icon: React.ReactNode
  label: string
  ref: React.Ref<HTMLButtonElement>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

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

export interface OverlayButtonProps {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  label: string
}

export interface OverlayCheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label: string
}

export interface OverlayInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
}

export interface OverlaySelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string
  options: string[]
  width?: string
}

export interface OverlayTextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
}

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
