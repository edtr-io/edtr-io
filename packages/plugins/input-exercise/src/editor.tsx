import { OverlayInput, OverlaySelect, useScopedSelector } from '@edtr-io/core'
import {
  AddButton,
  InteractiveAnswer,
  PreviewOverlay,
  styled,
} from '@edtr-io/editor-ui/internal'
import { invariant } from '@edtr-io/internal__dev-expression'
import { getFocused } from '@edtr-io/store'
import * as R from 'ramda'
import * as React from 'react'

import { InputExerciseProps, InputExerciseType } from '.'
import { InputExerciseRenderer } from './renderer'

const AnswerTextfield = styled.input({
  border: 'none',
  outline: 'none',
  width: '100%',
})

export function InputExerciseEditor(props: InputExerciseProps) {
  function translateDataType(type: InputExerciseType) {
    return props.config.i18n.types[type]
  }
  function translateDataName(name: string): InputExerciseType {
    console.log(name)
    for (const type of R.values(InputExerciseType)) {
      if (name === translateDataType(type)) return type
    }
    invariant(false, `Invalid type: ${name}`)
  }

  const { editable, state, focused, config } = props
  const { i18n } = config
  const focusedElement = useScopedSelector(getFocused())
  const nestedFocus =
    focused ||
    R.includes(
      focusedElement,
      props.state.answers.map((answer) => answer.feedback.id)
    )
  const [previewActive, setPreviewActive] = React.useState(false)
  return editable ? (
    <React.Fragment>
      <PreviewOverlay focused={nestedFocus} onChange={setPreviewActive}>
        <InputExerciseRenderer {...props} />
      </PreviewOverlay>
      {nestedFocus && !previewActive && (
        <React.Fragment>
          <div style={{ marginBottom: '0.5em' }}>
            <OverlaySelect
              label={i18n.type.label}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                state.type.set(translateDataName(event.target.value))
              }}
              value={translateDataType(state.type.value as InputExerciseType)}
              options={R.values(
                R.mapObjIndexed(translateDataType, InputExerciseType)
              )}
            />
          </div>
          {state.answers.map((answer, index: number) => {
            return (
              <InteractiveAnswer
                i18n={props.config.i18n}
                key={answer.feedback.id}
                answer={
                  <AnswerTextfield
                    value={answer.value.value}
                    placeholder={i18n.answer.value.placeholder}
                    type="text"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      answer.value.set(e.target.value)
                    }}
                  />
                }
                feedback={answer.feedback.render()}
                feedbackID={answer.feedback.id}
                isActive={answer.isCorrect.value}
                handleChange={() =>
                  answer.isCorrect.set(!answer.isCorrect.value)
                }
                remove={() => state.answers.remove(index)}
                focusedElement={focusedElement || undefined}
              />
            )
          })}
          <AddButton onClick={() => state.answers.insert()}>
            {i18n.answer.addLabel}
          </AddButton>
        </React.Fragment>
      )}
      {props.renderIntoSettings(
        <OverlayInput
          label={i18n.unit.label}
          value={state.unit.value}
          onChange={(e) => state.unit.set(e.target.value)}
        />
      )}
    </React.Fragment>
  ) : (
    <InputExerciseRenderer {...props} />
  )
}
