import { HighlightRenderer } from './renderer'
import styled from 'styled-components'
// import { Checkbox, Input, renderIntoSidebar } from '@splish-me/editor-ui'
import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'
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
        // TODO: Render into overlay
        <React.Fragment>
          <hr />
          Language:
          <input
            value={state.value.language.value || 'text'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              state.value.language.set(e.target.value)
            }}
            placeholder="enter"
          />
          <div>
            <a
              href="https://github.com/conorhastings/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD"
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
