import { useScopedStore } from '@edtr-io/core'
import { styled } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { Feedback, SubmitButton } from '@edtr-io/renderer-ui'
import { isEmpty } from '@edtr-io/store'
import { ThemeProps } from '@edtr-io/ui'
import A from 'algebra.js'
import * as React from 'react'
import S from 'string'

import { inputExerciseState, createInputExerciseTheme } from '.'

enum ExerciseState {
  Default = 1,
  SolvedRight,
  SolvedWrong
}

const InputExerciseField = styled.input<{ name: string } & ThemeProps>(
  ({ name, ...props }) => {
    const theme = createInputExerciseTheme(name, props.theme)
    return {
      border: 'none',
      borderBottom: `${theme.borderStyle} ${theme.borderColor}`,
      float: 'right',
      textAlign: 'center',
      outline: 'none',
      marginBottom: '10px'
    }
  }
)

export function InputExerciseRenderer(
  props: StatefulPluginEditorProps<typeof inputExerciseState>
) {
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

  const normalize = (type: string, string: string) => {
    const normalizeNumber = function(string: string) {
      return S(string).replaceAll(',', '.').s
    }
    const temp = S(string).collapseWhitespace()

    switch (type) {
      case 'input-number-exact-match-challenge':
        return S(normalizeNumber((temp as unknown) as string))
          .replaceAll(' /', '/')
          .replaceAll('/ ', '/').s
      case 'input-expression-equal-match-challenge':
        return A.parse(normalizeNumber((temp as unknown) as string))
      default:
        return temp.s.toUpperCase()
    }
  }
  const matchesInput = (
    field: { type: string; value: string },
    input: string
  ) => {
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
    state.answers().forEach((answer, index) => {
      if (
        input.current &&
        matchesInput(
          { type: state.type(), value: answer.value() },
          input.current.value
        )
      ) {
        setFeedbackIndex(index)
        if (answer.isCorrect()) {
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
        <div>
          <InputExerciseField
            name={props.name}
            onKeyDown={(k: React.KeyboardEvent<HTMLInputElement>) => {
              const { key } = (k as unknown) as KeyboardEvent
              if ((key === 'Enter' || key === 'Backspace') && props.editable) {
                k.stopPropagation()
              }
            }}
            data-type={state.type()}
            type="text"
            placeholder="Deine Lösung"
            ref={input}
          />
        </div>
        <div
          style={{
            clear: 'both'
          }}
        />

        {feedbackVisible ? (
          feedbackIndex > -1 ? (
            <Feedback
              boxFree
              isTrueAnswer={state.answers()[feedbackIndex].isCorrect()}
            >
              {isEmpty(state.answers()[feedbackIndex].feedback.id)(
                store.getState()
              )
                ? state.answers()[feedbackIndex].isCorrect()
                  ? 'Sehr gut!'
                  : 'Leider falsch!'
                : state.answers()[feedbackIndex].feedback.render()}
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
