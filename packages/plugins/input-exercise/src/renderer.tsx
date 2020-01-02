import { useScopedStore } from '@edtr-io/core'
import { styled } from '@edtr-io/editor-ui'
import { Feedback, SubmitButton } from '@edtr-io/renderer-ui'
import { isEmpty } from '@edtr-io/store'
import A from 'algebra.js'
import * as React from 'react'
import S from 'string'

import { InputExerciseConfig, InputExerciseProps } from '.'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}
const InputContainer = styled.div({
  float: 'right',
  display: 'flex',
  flexDirection: 'row'
})
const InputExerciseField = styled.input<{ config: InputExerciseConfig }>(
  ({ config }) => {
    const { theme } = config
    return {
      border: 'none',
      borderBottom: `${theme.borderStyle} ${theme.borderColor}`,

      textAlign: 'center',
      outline: 'none',
      marginBottom: '10px'
    }
  }
)

function normalizeNumber(string: string) {
  return S(string).replaceAll(',', '.').s
}

function normalize(type: string, string: string) {
  const temp = S(string).collapseWhitespace()

  switch (type) {
    case 'input-number-exact-match-challenge':
      return S(normalizeNumber(temp.s))
        .replaceAll(' /', '/')
        .replaceAll('/ ', '/').s
    case 'input-expression-equal-match-challenge':
      return A.parse(normalizeNumber(temp.s))
    default:
      return temp.s.toUpperCase()
  }
}

function matchesInput(field: { type: string; value: string }, input: string) {
  try {
    const solution = normalize(field.type, field.value)
    const submission = normalize(field.type, input)

    switch (field.type) {
      case 'input-expression-equal-match-challenge':
        return (
          (solution as A.Expression)
            .subtract(submission as A.Expression)
            .toString() === '0'
        )
      default:
        return solution === submission
    }
  } catch (err) {
    // e.g. if user input could not be parsed
    return false
  }
}

export function InputExerciseRenderer(props: InputExerciseProps) {
  const { state } = props
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
          { type: state.type.value, value: answer.value.value },
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
            placeholder="Deine Lösung"
            ref={input}
          />
          {state.unit.value}
        </InputContainer>
        <div
          style={{
            clear: 'both'
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
                  ? 'Sehr gut!'
                  : 'Leider falsch!'
                : state.answers[feedbackIndex].feedback.render()}
            </Feedback>
          ) : (
            <Feedback boxFree> Leider falsch!</Feedback>
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
