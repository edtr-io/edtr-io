import React, { useState, useRef, useEffect } from 'react'
import { Editor as SlateEditor, Range } from 'slate'

import type { TextEditorPluginConfig, ControlButton } from '../types'
import { isTouchDevice } from '../utils/is-touch-device'
import { HoveringToolbarControls } from './hovering-toolbar-controls'
import { InlineOverlay, InlineOverlayPosition } from './inline-overlay'
import { TimeoutBottomToolbarWrapper } from './timeout-bottom-toolbar-wrapper'

export interface HoveringToolbarProps {
  editor: SlateEditor
  config: TextEditorPluginConfig
  controls: ControlButton[]
  text: string
  focused: boolean
}

const initialPosition = isTouchDevice()
  ? InlineOverlayPosition.below
  : InlineOverlayPosition.above

export function HoveringToolbar(props: HoveringToolbarProps) {
  const [isBottomToolbarActive, setIsBottomToolbarActive] = useState(false)
  const { editor, config, controls, text, focused } = props
  const { selection } = editor
  const isSelectionCollapsed = selection && Range.isCollapsed(selection)

  const memoized = useRef({ value: text, isSelectionCollapsed })
  const showBottomToolbar = () => setIsBottomToolbarActive(true)
  useEffect(() => {
    let debounceTimeout = setTimeout(showBottomToolbar, 2500)
    const hasValueChanged = memoized.current.value !== text
    if (
      hasValueChanged ||
      memoized.current.isSelectionCollapsed !== isSelectionCollapsed
    ) {
      memoized.current = { value: text, isSelectionCollapsed }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      const timeout = hasValueChanged ? 2500 : 1000
      if (isSelectionCollapsed) {
        debounceTimeout = setTimeout(showBottomToolbar, timeout)
      }
      setIsBottomToolbarActive(false)
    }

    return () => {
      clearTimeout(debounceTimeout)
    }
  }, [text, isSelectionCollapsed])

  return (
    <>
      <InlineOverlay
        config={config}
        initialPosition={initialPosition}
        hidden={
          !selection ||
          !focused ||
          isSelectionCollapsed ||
          SlateEditor.string(editor, selection) === ''
        }
      >
        <HoveringToolbarControls
          theme={config.theme}
          controls={controls}
          editor={editor}
        />
      </InlineOverlay>
      <TimeoutBottomToolbarWrapper
        isTouch={isTouchDevice()}
        visible={!!isSelectionCollapsed && isBottomToolbarActive}
      >
        {isBottomToolbarActive && (
          <HoveringToolbarControls
            theme={config.theme}
            controls={controls}
            editor={editor}
          />
        )}
      </TimeoutBottomToolbarWrapper>
    </>
  )
}
