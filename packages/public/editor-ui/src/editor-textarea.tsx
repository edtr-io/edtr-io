import { IgnoreKeys } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'

const StyledIgnoreKeys = styled(IgnoreKeys)({
  width: '100%',
})

/** @public */
export interface EditorTextareaProps
  extends Omit<TextareaAutosizeProps, 'as' | 'ref'> {
  onMoveOutRight?(): void
  onMoveOutLeft?(): void
}

/** @public */
export const EditorTextarea = React.forwardRef<
  HTMLTextAreaElement,
  EditorTextareaProps
>(function EditorTextarea({ onMoveOutLeft, onMoveOutRight, ...props }, ref) {
  return (
    <StyledIgnoreKeys except={['up', 'down']}>
      <TextareaAutosize
        {...props}
        style={{
          width: '100%',
          margin: 'auto',
          padding: '10px',
          resize: 'none',
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          border: 'none',
          outline: 'none',
          boxShadow: '0 1px 1px 0 rgba(0,0,0,0.50)',
          ...props.style,
        }}
        minRows={7}
        ref={ref}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (!ref || typeof ref === 'function' || !ref.current) return

          const { selectionStart, selectionEnd, value } = ref.current

          const selectionCollapsed = selectionStart === selectionEnd
          const caretAtRightEnd = selectionEnd === value.length
          const caretAtLeftEnd = selectionStart === 0

          if (
            e.key === 'ArrowRight' &&
            !e.shiftKey &&
            selectionCollapsed &&
            caretAtRightEnd &&
            typeof onMoveOutRight === 'function'
          ) {
            onMoveOutRight()
          }

          if (
            e.key === 'ArrowLeft' &&
            !e.shiftKey &&
            selectionCollapsed &&
            caretAtLeftEnd &&
            typeof onMoveOutLeft === 'function'
          ) {
            onMoveOutLeft()
          }

          if (e.key === 'ArrowUp' && selectionCollapsed && !caretAtLeftEnd) {
            e.stopPropagation()
          }

          if (e.key === 'ArrowDown' && selectionCollapsed && !caretAtRightEnd) {
            e.stopPropagation()
          }
        }}
      />
    </StyledIgnoreKeys>
  )
})
