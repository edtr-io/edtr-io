import {
  EditorCheckbox,
  EditorInput,
  PrimarySettings
} from '@edtr-io/editor-ui'
import { StatefulPlugin, StatefulPluginEditorProps } from '@edtr-io/plugin'
import { faCode, styled, createIcon } from '@edtr-io/ui'
import * as React from 'react'

import { highlightState } from '.'
import { HighlightRendererProps } from './renderer'

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

export const createHighlightEditor = (config: HighlightPluginConfig) =>
  function HighlightEditor(
    props: StatefulPluginEditorProps<typeof highlightState>
  ) {
    const Renderer = config.renderer

    const { state, focused, editable } = props

    const edit = focused && editable
    const [throttledEdit, setEditThrotteled] = React.useState(edit)
    if (edit != throttledEdit) {
      if (!edit) {
        setTimeout(() => {
          setEditThrotteled(false)
        }, 500)
      } else {
        setEditThrotteled(true)
      }
    }
    return throttledEdit || edit ? (
      <React.Fragment>
        <Textarea
          value={state.text.value}
          name="text"
          placeholder="Füge hier deinen Code ein. Verlasse den Bereich, um eine Vorschau zu sehen."
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            state.text.set(e.target.value)
          }}
        >
          {state.text.value}
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
                state.lineNumbers.set(!state.lineNumbers.value)
              }}
              checked={state.lineNumbers.value}
            />
          </CheckboxContainer>
        </PrimarySettings>
      </React.Fragment>
    ) : (
      <Renderer
        language={state.language.value}
        lineNumbers={state.lineNumbers.value}
        code={state.text.value}
      />
    )
  }

export function createHighlightPlugin(
  config: HighlightPluginConfig
): StatefulPlugin<typeof highlightState> {
  return {
    Component: createHighlightEditor(config),
    state: highlightState,
    title: 'Code',
    description:
      'Schreibe Code und lasse ihn je nach Programmiersprache highlighten.',
    icon: createIcon(faCode)
  }
}

export interface HighlightPluginConfig {
  renderer: React.ComponentType<HighlightRendererProps>
}
