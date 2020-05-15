import { IgnoreKeys } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'

const Textarea = styled(TextareaAutosize)({
  minHeight: '100px',
  width: '100%',
  margin: 'auto',
  padding: '10px',
  resize: 'none',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  border: 'none',
  outline: 'none',
  boxShadow: '0 1px 1px 0 rgba(0,0,0,0.50)',
  '&::-webkit-input-placeholder': {
    color: 'rgba(0,0,0,0.5)',
  },
})

const StyledIgnoreKeys = styled(IgnoreKeys)({
  width: '100%',
})

/** @public */
export const EditorTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<TextareaAutosizeProps, 'as' | 'ref'>
>(function EditorTextarea(props, ref) {
  return (
    <StyledIgnoreKeys except={['up', 'down']}>
      <Textarea
        {...props}
        inputRef={ref || undefined}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
            return
          }
          if (ref && typeof ref !== 'function' && ref.current) {
            const { selectionStart, selectionEnd, value } = ref.current

            if (selectionStart !== selectionEnd) {
              return
            }

            if (e.key === 'ArrowUp' && selectionStart !== 0) {
              e.stopPropagation()
            }
            if (e.key === 'ArrowDown' && selectionStart !== value.length) {
              e.stopPropagation()
            }
          }
        }}
      />
    </StyledIgnoreKeys>
  )
})
