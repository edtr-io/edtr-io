import { OverlayInput, OverlaySelect, useScopedSelector } from '@edtr-io/core'
import {
  AddButton,
  InteractiveAnswer,
  PreviewOverlay,
  styled
} from '@edtr-io/editor-ui'
import { getFocused } from '@edtr-io/store'
import * as R from 'ramda'
import * as React from 'react'

import { InputExerciseProps } from '.'
import { InputExerciseRenderer } from './renderer'

const types = [
  {
    name: 'Text',
    type: 'input-string-normalized-match-challenge'
  },
  {
    name: 'Zahl',
    type: 'input-number-exact-match-challenge'
  },
  {
    name: 'Ausdruck',
    type: 'input-expression-equal-match-challenge'
  }
]

const AnswerTextfield = styled.input({
  border: 'none',
  outline: 'none',
  width: '100%'
})
export function InputExerciseEditor(props: InputExerciseProps) {
  function translateDataType(type: string) {
    for (let i = 0; i < types.length; i++) {
      if (type === types[i].type) return types[i].name
    }
    return ''
  }
  function translateDataName(name: string) {
    for (let i = 0; i < types.length; i++) {
      if (name === types[i].name) return types[i].type
    }
    return ''
  }

  const { editable, state, focused } = props
  const focusedElement = useScopedSelector(getFocused())
  const nestedFocus =
    focused ||
    R.includes(
      focusedElement,
      props.state.answers.map(answer => answer.feedback.id)
    )
  const [previewActive, setPreviewActive] = React.useState(false)
  return (
    <React.Fragment>
      {editable ? (
        <React.Fragment>
          <PreviewOverlay focused={nestedFocus} onChange={setPreviewActive}>
            <InputExerciseRenderer {...props} />
          </PreviewOverlay>
          {nestedFocus && !previewActive ? (
            <React.Fragment>
              {state.answers.map((answer, index: number) => {
                return (
                  <InteractiveAnswer
                    key={answer.feedback.id}
                    answer={
                      <AnswerTextfield
                        value={answer.value.value}
                        placeholder="Gib hier deine Antwort ein"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          answer.value.set(e.target.value)
                        }}
                      />
                    }
                    feedback={answer.feedback.render()}
                    feedbackID={answer.feedback.id}
                    isActive={answer.isCorrect.value}
                    handleChange={() => {
                      answer.isCorrect.set(!answer.isCorrect.value)
                    }}
                    remove={() => {
                      state.answers.remove(index)
                    }}
                    focusedElement={focusedElement || undefined}
                  />
                )
              })}
              <AddButton onClick={() => state.answers.insert()}>
                Antwort hinzufügen...
              </AddButton>
            </React.Fragment>
          ) : null}
          {props.renderIntoSettings(
            <React.Fragment>
              <OverlayInput
                label="Einheit (optional)"
                value={state.unit.value}
                onChange={e => {
                  state.unit.set(e.target.value)
                }}
              />
              <OverlaySelect
                label="Wähle den Antworttyp"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  state.type.set(translateDataName(event.target.value))
                }}
                value={translateDataType(state.type.value)}
                options={R.map(type => {
                  return type.name
                }, types)}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <InputExerciseRenderer {...props} />
      )}
    </React.Fragment>
  )
}
