import {
  EditorCheckbox,
  EditorInput,
  PrimarySettings
} from '@edtr-io/editor-ui'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { HighlightProps } from '.'

const Textarea = styled.textarea({
  height: '250px',
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

const CheckboxContainer = styled.div({
  float: 'right'
})

export function HighlightEditor(props: HighlightProps) {
  const { config, state, focused, editable } = props
  const { Renderer } = config

  const edit = focused && editable
  const [throttledEdit, setEditThrottled] = React.useState(edit)
  if (edit != throttledEdit) {
    if (!edit) {
      setTimeout(() => {
        setEditThrottled(false)
      }, 500)
    } else {
      setEditThrottled(true)
    }
  }
  return throttledEdit || edit ? (
    <React.Fragment>
      <Textarea
        value={state.code.value}
        name="text"
        placeholder="Füge hier deinen Code ein. Verlasse den Bereich, um eine Vorschau zu sehen."
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          state.code.set(e.target.value)
        }}
      >
        {state.code.value}
      </Textarea>
      <PrimarySettings>
        <EditorInput
          list="available-languages"
          label="Language:"
          value={state.language.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            state.language.set(e.target.value)
          }}
          placeholder="enter Language"
        />
        <datalist id="available-languages">
          {['c', 'javascript', 'jsx', 'markup', 'java', 'python'].map(
            (language, index) => {
              return <option key={index} value={language} />
            }
          )}
        </datalist>
        <CheckboxContainer>
          <EditorCheckbox
            label="Zeilennummern anzeigen"
            onChange={() => {
              state.showLineNumbers.set(!state.showLineNumbers.value)
            }}
            checked={state.showLineNumbers.value}
          />
        </CheckboxContainer>
      </PrimarySettings>
    </React.Fragment>
  ) : (
    <Renderer
      language={state.language.value}
      showLineNumbers={state.showLineNumbers.value}
      code={state.code.value}
    />
  )
}
