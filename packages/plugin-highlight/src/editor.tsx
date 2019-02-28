import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { HighlightRenderer } from './renderer'
import { highlightState } from '.'

const Textarea = styled.textarea({
  height: '250px',
  width: '100%',
  padding: '5px',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace'
})

export const HighlightEditor = (
  props: StatefulPluginEditorProps<typeof highlightState>
) => {
  const { state, focused, editable } = props

  return (
    <React.Fragment>
      {!editable ? (
        <HighlightRenderer {...props} />
      ) : (
        <Textarea
          value={state.value.text.value}
          name="text"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            state.value.text.set(e.target.value)
          }}
        >
          {state.value.text.value}
        </Textarea>
      )}
      {focused ? (
        <React.Fragment>
          <hr />
          Language:
          <input
            value={state.value.language.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.value.language.set(e.target.value)
            }}
            placeholder="enter"
          />
          <div>
            <a
              href="https://github.com/conorhastings/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD"
              rel="noopener noreferrer"
              target="_blank"
            >
              Available languages
            </a>
          </div>
          Show line numbers
          <input
            type="checkbox"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.value.lineNumbers.set(e.target.checked)
            }}
            checked={state.value.lineNumbers.value}
          />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
