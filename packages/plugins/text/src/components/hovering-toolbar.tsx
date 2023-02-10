import React from 'react'
import { Editor as SlateEditor, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import type { HoveringToolbarProps } from '../types'
import { isTouchDevice } from '../utils/is-touch-device'
import { HoveringToolbarControls } from './hovering-toolbar-controls'
import { InlineOverlay, InlineOverlayPosition } from './inline-overlay'

const initialPosition = isTouchDevice()
  ? InlineOverlayPosition.below
  : InlineOverlayPosition.above

export function HoveringToolbar({
  closeSubMenuIcon,
  closeSubMenuTitle,
  config,
}: HoveringToolbarProps) {
  const editor = useSlate()
  const { selection } = editor

  return (
    <InlineOverlay
      initialPosition={initialPosition}
      hidden={
        !selection ||
        !ReactEditor.isFocused(editor) ||
        Range.isCollapsed(selection) ||
        SlateEditor.string(editor, selection) === ''
      }
    >
      <HoveringToolbarControls
        editor={editor}
        config={config}
        closeSubMenuIcon={closeSubMenuIcon}
        closeSubMenuTitle={closeSubMenuTitle}
      />
    </InlineOverlay>
  )
}
