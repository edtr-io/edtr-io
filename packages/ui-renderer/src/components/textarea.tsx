/**
 * @module @edtr-io/renderer-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { IgnoreKeys } from 'react-hotkeys'
import TextareaAutosize, {
  TextareaAutosizeProps
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
    color: 'rgba(0,0,0,0.5)'
  }
})

const StyledIgnoreKeys = styled(IgnoreKeys)({
  width: '100%'
})

export function EditorTextarea(
  props: Omit<TextareaAutosizeProps, 'as' | 'ref'>
) {
  return (
    <StyledIgnoreKeys>
      <Textarea {...props} />
    </StyledIgnoreKeys>
  )
}
