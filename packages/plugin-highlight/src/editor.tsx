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
          value={state.text.value}
          name="text"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            state.text.set(() => e.target.value)
          }}
        >
          {state.text.value}
        </Textarea>
      )}
      {focused ? (
        <React.Fragment>
          <hr />
          Language:
          <input
            value={state.language.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.language.set(() => e.target.value)
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
              state.lineNumbers.set(() => e.target.checked)
            }}
            checked={state.lineNumbers.value}
          />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
