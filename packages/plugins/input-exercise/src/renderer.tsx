import { useScopedStore } from '@edtr-io/core'
import { styled } from '@edtr-io/editor-ui'
import { Feedback, SubmitButton } from '@edtr-io/renderer-ui/internal'
import { isEmpty } from '@edtr-io/store'
import A from 'algebra.js'
import * as React from 'react'

import {
  InputExercisePluginConfig,
  InputExerciseProps,
  InputExerciseType,
} from '.'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong,
}
const InputContainer = styled.div({
  float: 'right',
  display: 'flex',
  flexDirection: 'row',
})
const InputExerciseField = styled.input<{ config: InputExercisePluginConfig }>(
  ({ config }) => {
    const { theme } = config
    return {
      border: 'none',
      borderBottom: `${theme.borderStyle} ${theme.borderColor}`,

      textAlign: 'center',
      outline: 'none',
      marginBottom: '10px',
    }
  }
)

function normalizeNumber(numberText: string) {
  return numberText.replace(/,/g, '.').replace(/^[+]/, '')
}

function normalize(type: InputExerciseType, text: string) {
  const temp = collapseWhitespace(text)

  switch (type) {
    case InputExerciseType.InputNumberExactMatchChallenge:
      return normalizeNumber(temp).replace(/\s/g, '')
    case InputExerciseType.InputExpressionEqualMatchChallenge:
      return A.parse(normalizeNumber(temp))
    case InputExerciseType.InputStringNormalizedMatchChallenge:
      return temp.toUpperCase()
  }
}

function matchesInput(
  field: { type: InputExerciseType; value: string },
  input: string
) {
  try {
    const solution = normalize(field.type, field.value)
    const submission = normalize(field.type, input)

    switch (field.type) {
      case InputExerciseType.InputExpressionEqualMatchChallenge:
        return (
          (solution as A.Expression)
            .subtract(submission as A.Expression)
            .toString() === '0'
        )
      case InputExerciseType.InputNumberExactMatchChallenge:
      case InputExerciseType.InputStringNormalizedMatchChallenge:
        return solution === submission
    }
  } catch (err) {
    // e.g. if user input could not be parsed
    return false
  }
}

export function InputExerciseRenderer(props: InputExerciseProps) {
  const { state } = props
  const { i18n } = props.config
  const store = useScopedStore()
  const [feedbackIndex, setFeedbackIndex] = React.useState<number>(-1)
  const [feedbackVisible, setFeedbackVisible] = React.useState<boolean>()
  const [exerciseState, setExerciseState] = React.useState<ExerciseState>(
    ExerciseState.Default
  )
  const input = React.createRef<HTMLInputElement>()
  const handleWrongAnswer = () => {
    setTimeout(() => {
      setExerciseState(ExerciseState.Default)
    }, 2000)
    setExerciseState(ExerciseState.SolvedWrong)
  }

  function checkAnswer(event: React.FormEvent) {
    if (!input.current) {
      return
    }
    event.preventDefault()
    setFeedbackIndex(-1)
    setFeedbackVisible(true)
    setExerciseState(ExerciseState.Default)
    if (input.current.value === '') {
      setFeedbackVisible(false)
      return
    }
    const { state } = props

    let containedAnswer = false
    state.answers.forEach((answer, index) => {
      if (
        input.current &&
        matchesInput(
          {
            type: state.type.value as InputExerciseType,
            value: answer.value.value,
          },
          input.current.value
        )
      ) {
        setFeedbackIndex(index)
        if (answer.isCorrect.value) {
          setExerciseState(ExerciseState.SolvedRight)
        } else {
          handleWrongAnswer()
        }
        containedAnswer = true
      }
    })

    if (!containedAnswer) {
      handleWrongAnswer()
    }
  }

  return (
    <div>
      <form onSubmit={checkAnswer}>
        <InputContainer>
          <InputExerciseField
            config={props.config}
            onKeyDown={(k: React.KeyboardEvent<HTMLInputElement>) => {
              const { key } = (k as unknown) as KeyboardEvent
              if ((key === 'Enter' || key === 'Backspace') && props.editable) {
                k.stopPropagation()
              }
            }}
            data-type={state.type.value}
            type="text"
            placeholder={i18n.inputPlaceholder}
            ref={input}
          />
          {state.unit.value}
        </InputContainer>
        <div
          style={{
            clear: 'both',
          }}
        />

        {feedbackVisible ? (
          feedbackIndex > -1 ? (
            <Feedback
              boxFree
              isTrueAnswer={state.answers[feedbackIndex].isCorrect.value}
            >
              {isEmpty(state.answers[feedbackIndex].feedback.id)(
                store.getState()
              )
                ? state.answers[feedbackIndex].isCorrect.value
                  ? i18n.fallbackFeedback.correct
                  : i18n.fallbackFeedback.wrong
                : state.answers[feedbackIndex].feedback.render()}
            </Feedback>
          ) : (
            <Feedback boxFree>{i18n.fallbackFeedback.wrong}</Feedback>
          )
        ) : null}
        <div>
          <SubmitButton exerciseState={exerciseState} />
          <div style={{ clear: 'both' }} />
        </div>
      </form>
    </div>
  )
}

function collapseWhitespace(text: string) {
  return text.replace(/[\s\xa0]+/g, ' ').trim()
}
