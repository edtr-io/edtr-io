import {
  EditorCheckbox,
  EditorInput,
  Icon,
  PrimarySettings,
  faQuestionCircle,
  styled
} from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { EditorTextarea } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { highlightState } from '.'
import { HighlightRenderer } from './renderer'

const QuestionIcon = styled(Icon)({
  color: 'black',
  margin: '0 10px -3px 5px',
  '&:hover': {
    color: 'rgba(0,0,0,0.5)'
  }
})

const CheckboxContainer = styled.div({
  float: 'right'
})

// TODO: type and theming. maybe put in editor-ui?
const HelpIcon: React.FunctionComponent = () => (
  <a
    href="https://github.com/conorhastings/react-syntax-highlighter/blob/master/AVAILABLE_LANGUAGES_HLJS.MD"
    rel="noopener noreferrer"
    target="_blank"
    title="Available Languages"
  >
    <QuestionIcon icon={faQuestionCircle} />
  </a>
)

export const HighlightEditor = (
  props: StatefulPluginEditorProps<typeof highlightState> & {
    insert?: (el: { plugin: string }) => void
  }
) => {
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
      <EditorTextarea
        value={state.text.value}
        name="text"
        placeholder="Write some code here. Preview will be shown when you leave the area"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          state.text.set(e.target.value)
        }}
      >
        {state.text.value}
      </EditorTextarea>
      <PrimarySettings>
        <EditorInput
          label="Language:"
          value={state.language.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            state.language.set(e.target.value)
          }}
          placeholder="enter Language"
        />
        <HelpIcon />
        <CheckboxContainer>
          <EditorCheckbox
            label="Show Line Numbers"
            onChange={() => {
              state.lineNumbers.set(!state.lineNumbers.value)
            }}
            checked={state.lineNumbers.value}
          />
        </CheckboxContainer>
      </PrimarySettings>
    </React.Fragment>
  ) : (
    <HighlightRenderer {...props} />
  )
}
