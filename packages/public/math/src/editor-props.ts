import { DeepPartial } from '@edtr-io/ui'

import { MathEditorConfig } from './editor-config'

/** @public */
export interface MathEditorProps {
  autofocus?: boolean
  state: string
  inline?: boolean
  readOnly?: boolean
  visual?: boolean
  disableBlock?: boolean
  config: DeepPartial<MathEditorConfig>
  additionalContainerProps?: Record<string, unknown>
  onEditorChange(visual: boolean): void
  onInlineChange?(inline: boolean): void
  onChange(state: string): void
  onMoveOutRight?(): void
  onMoveOutLeft?(): void
  onDeleteOutRight?(): void
  onDeleteOutLeft?(): void
}
