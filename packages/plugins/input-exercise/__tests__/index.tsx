/*
 * @jest-environment jsdom-sixteen
 */

// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom'
import { EditorPlugin } from '@edtr-io/plugin'
import { plugin as inputExercisePlugin } from '@edtr-io/plugin-input-exercise/__fixtures__'
import { plugin as textPlugin } from '@edtr-io/plugin-text/__fixtures__'
import { Renderer } from '@edtr-io/renderer'
import { render, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

afterEach(cleanup)

describe('input challenge', () => {
  let exercise: InputExercise

  describe('shows feedback about submitted answer', () => {
    beforeEach(() => {
      exercise = createInputExercise({
        answers: [createAnswer({ answer: 'right solution' })],
      })
    })

    describe('displays a feedback after submission', () => {
      test('when answer is correct', () => {
        expect(exercise.queryByText('Correct')).toBeNull()

        submitAnswer(exercise, 'right solution')

        expect(exercise.getByText('Correct')).toBeVisible()
      })

      test('when answer is false', () => {
        expect(exercise.queryByText('Wrong')).toBeNull()

        submitAnswer(exercise, 'wrong answer')

        expect(exercise.getByText('Wrong')).toBeVisible()
      })
    })

    test('submit button changes text when answer is correct', () => {
      submitAnswer(exercise, 'right solution')

      expect(
        exercise.getByText('Stimmt!', { selector: 'button > span' })
      ).toBeVisible()
    })

    describe('shows result of the last submitted answer', () => {
      test('when last answer is correct', () => {
        submitAnswer(exercise, 'wrong answer')
        submitAnswer(exercise, 'right solution')

        expect(exercise.getByText('Correct')).toBeVisible()
      })

      test('when last answer is false', () => {
        submitAnswer(exercise, 'right solution')
        submitAnswer(exercise, 'wrong answer')

        expect(exercise.getByText('Wrong')).toBeVisible()
      })
    })
  })

  describe('shows feedback of predefined answers', () => {
    beforeEach(() => {
      exercise = createInputExercise({
        answers: [
          createAnswer({
            answer: 'right solution',
            feedback: 'Correct answer!',
          }),
          createAnswer({
            answer: 'wrong solution',
            isCorrect: false,
            feedback: 'Wrong answer!',
          }),
        ],
      })
    })

    test('shows feedback of correct input when it is predefined', () => {
      submitAnswer(exercise, 'right solution')

      expect(exercise.getByText('Correct answer!')).toBeVisible()
    })

    test('shows feedback of wrong input when it is predefined', () => {
      submitAnswer(exercise, 'wrong solution')

      expect(exercise.getByText('Wrong answer!')).toBeVisible()
    })

    test('shows default feedback when answer is not in the list', () => {
      submitAnswer(exercise, 'another wrong solution')

      expect(exercise.getByText('Wrong')).toBeVisible()
    })
  })

  describe('normalizes the answer', () => {
    describe('type = input-string-normalized-match-challenge', () => {
      beforeEach(() => {
        exercise = createInputExercise({
          type: 'input-string-normalized-match-challenge',
          answers: [createAnswer({ answer: 'Right Solution' })],
        })
      })

      test('wrong whitespaces are ignored', () => {
        expectAnswerIsAccepted(exercise, '   Right   Solution   ')
      })

      test('differences in lower and upper case are ignored', () => {
        expectAnswerIsAccepted(exercise, 'rIGHT sOLUTION')
      })
    })

    describe('type = input-number-exact-match-challenge', () => {
      test('differences between "," and "." are ignored', () => {
        exercise = createInputExercise({
          type: 'input-number-exact-match-challenge',
          answers: [createAnswer({ answer: '1.200,5' })],
        })

        expectAnswerIsAccepted(exercise, '1,200.5')
      })

      test('whitespaces around "/" are ignored', () => {
        exercise = createInputExercise({
          type: 'input-number-exact-match-challenge',
          answers: [createAnswer({ answer: '3/4' })],
        })

        expectAnswerIsAccepted(exercise, '3 / 4')
      })
    })

    describe('type = input-expression-equal-match-challenge', () => {
      test('algebraic differences are ignored', () => {
        exercise = createInputExercise({
          type: 'input-expression-equal-match-challenge',
          answers: [createAnswer({ answer: '1+x^2' })],
        })

        expectAnswerIsAccepted(exercise, 'x*x + 1')
      })
    })

    function expectAnswerIsAccepted(exercise: InputExercise, answer: string) {
      submitAnswer(exercise, answer)

      expect(exercise.getByText('Correct')).toBeVisible()
    }
  })
})

type InputExercise = ReturnType<typeof render>

function createInputExercise({
  answers,
  type = 'input-string-normalized-match-challenge',
}: {
  answers: ReturnType<typeof createAnswer>[]
  type?: string
}): InputExercise {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: Record<string, EditorPlugin<any, any>> = {
    inputExercise: inputExercisePlugin,
    text: textPlugin,
  }

  const state = {
    plugin: 'inputExercise',
    state: {
      type: type,
      unit: '',
      answers,
    },
  }

  return render(<Renderer plugins={plugins} state={state} />)
}

function createAnswer({
  answer,
  isCorrect = true,
  feedback = '',
}: {
  answer: string
  feedback?: string
  isCorrect?: boolean
}) {
  return {
    value: answer,
    isCorrect,
    feedback: {
      plugin: 'text',
      state: [{ type: 'p', children: [{ text: feedback }] }],
    },
  }
}

function submitAnswer(exercise: InputExercise, answer: string) {
  const input = exercise.getByPlaceholderText('Your solution')

  userEvent.clear(input)
  userEvent.type(input, answer)

  const submitButton =
    exercise.queryByText('Stimmt’s?') ?? exercise.getByText('Stimmt!')

  userEvent.click(submitButton)
}
