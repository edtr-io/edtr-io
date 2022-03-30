import { OverlayInput, useScopedSelector } from '@edtr-io/core'
import {
  AddButton,
  InteractiveAnswer,
  PreviewOverlay,
  styled,
} from '@edtr-io/editor-ui/internal'
import { getFocused } from '@edtr-io/store'
import * as R from 'ramda'
import * as React from 'react'

import { InputExerciseProps, InputExerciseType } from '.'
import { useInputExerciseConfig } from './config'
import { InputExerciseRenderer } from './renderer'

const AnswerTextfield = styled.input({
  border: 'none',
  outline: 'none',
  width: '100%',
})

const TypeMenu = styled.div({
  marginBottom: '0.5em',
})

export function InputExerciseEditor(props: InputExerciseProps) {
  const { editable, state, focused, config } = props
  const { i18n } = useInputExerciseConfig(config)
  const focusedElement = useScopedSelector(getFocused())
  const nestedFocus =
    focused ||
    R.includes(
      focusedElement,
      props.state.answers.map((answer) => answer.feedback.id)
    )
  const [previewActive, setPreviewActive] = React.useState(false)

  if (!editable) return <InputExerciseRenderer {...props} />

  return (
    <React.Fragment>
      <PreviewOverlay focused={nestedFocus} onChange={setPreviewActive}>
        <InputExerciseRenderer {...props} />
      </PreviewOverlay>
      {nestedFocus && !previewActive && (
        <React.Fragment>
          <TypeMenu>
            <label>
              {i18n.type.label}:{' '}
              <select
                value={state.type.value}
                onChange={(event) => state.type.set(event.target.value)}
              >
                {Object.values(InputExerciseType).map((exerciseType) => (
                  <option key={exerciseType} value={exerciseType}>
                    {i18n.types[exerciseType]}
                  </option>
                ))}
              </select>
            </label>
          </TypeMenu>
          {state.answers.map((answer, index: number) => {
            return (
              <InteractiveAnswer
                i18n={i18n}
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
  )
}
