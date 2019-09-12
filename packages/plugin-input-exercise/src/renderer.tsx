import { useScopedStore } from '@edtr-io/core'
import { isEmpty } from '@edtr-io/store'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { Feedback } from '@edtr-io/renderer-ui'
import A from 'algebra.js'
import * as React from 'react'
import S from 'string'

import { inputExerciseState } from '.'

export function InputExerciseRenderer(
  props: StatefulPluginEditorProps<typeof inputExerciseState>
) {
  const { state } = props
  const store = useScopedStore()
  const [feedbackIndex, setFeedbackIndex] = React.useState<number>(-1)
  const [feedbackVisible, setFeedbackVisible] = React.useState<boolean>()
  const input = React.createRef<HTMLInputElement>()

  function checkAnswer(event: React.FormEvent) {
    if (!input.current) {
      return
    }
    event.preventDefault()
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
        setFeedbackVisible(true)
        setFeedbackIndex(index)
        containedAnswer = true
      }
    })

    if (!containedAnswer) {
      setFeedbackVisible(true)
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

  return (
    <div className="new-text-exercise active">
      <form className="input-challenge-group" onSubmit={checkAnswer}>
        <div className="input-challenge-input-wrapper pull-right">
          <input
            className="input-challenge-input"
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
        ) : null}
        <div className="input-challenge-solution">
          <button className="btn btn-primary btn-xs input-challenge-submit pull-right">
            <span className="input-challenge-submit-check">
              <i className="fa fa-check-circle" />
              Stimmts?
            </span>
            <span className="input-challenge-submit-correct">
              <i className="fa fa-smile-o" />
              Stimmt!
            </span>
          </button>
          <div style={{ clear: 'both' }} />
        </div>
      </form>
    </div>
  )
}
