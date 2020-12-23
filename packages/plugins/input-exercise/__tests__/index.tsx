import { EditorPlugin } from '@edtr-io/plugin'
import { plugin as inputExercisePlugin } from '@edtr-io/plugin-input-exercise/__fixtures__'
import { plugin as textPlugin } from '@edtr-io/plugin-text/__fixtures__'
import { Renderer } from '@edtr-io/renderer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

describe('shows feedback about submitted answer', () => {
  beforeEach(() => {
    createInputExercise({
      answers: [createAnswer({ answer: 'right solution' })],
    })
  })

  test('does not show the feedback at the beginning', () => {
    expect(screen.queryByText('Correct')).not.toBeInTheDocument()
  })

  describe('displays a feedback after submission', () => {
    test('when answer is correct', () => {
      submitAnswer('right solution')

      expect(screen.getByText('Correct')).toBeVisible()
    })

    test('when answer is false', () => {
      submitAnswer('wrong answer')

      expect(screen.getByText('Wrong')).toBeVisible()
    })
  })

  test('submit button changes text when answer is correct', () => {
    submitAnswer('right solution')

    expect(screen.getByText('Stimmt!')).toBeVisible()
  })

  describe('shows result of the last submitted answer', () => {
    test('when last answer is correct', () => {
      submitAnswer('wrong answer')
      submitAnswer('right solution')

      expect(screen.getByText('Correct')).toBeVisible()
    })

    test('when last answer is false', () => {
      submitAnswer('right solution')
      submitAnswer('wrong answer')

      expect(screen.getByText('Wrong')).toBeVisible()
    })
  })
})

describe('shows feedback of predefined answers', () => {
  beforeEach(() => {
    createInputExercise({
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
    submitAnswer('right solution')

    expect(screen.getByText('Correct answer!')).toBeVisible()
  })

  test('shows feedback of wrong input when it is predefined', () => {
    submitAnswer('wrong solution')

    expect(screen.getByText('Wrong answer!')).toBeVisible()
  })

  test('shows default feedback when answer is not in the list', () => {
    submitAnswer('another wrong solution')

    expect(screen.getByText('Wrong')).toBeVisible()
  })
})

describe('normalizes the answer', () => {
  describe('type = input-string-normalized-match-challenge', () => {
    beforeEach(() => {
      createInputExercise({
        type: 'input-string-normalized-match-challenge',
        answers: [createAnswer({ answer: 'Right Solution' })],
      })
    })

    test('wrong whitespaces are ignored', () => {
      expectAnswerIsAccepted('   Right   Solution   ')
    })

    test('differences in lower and upper case are ignored', () => {
      expectAnswerIsAccepted('rIGHT sOLUTION')
    })
  })

  describe('type = input-number-exact-match-challenge', () => {
    test('differences between "," and "." are ignored', () => {
      createInputExercise({
        type: 'input-number-exact-match-challenge',
        answers: [createAnswer({ answer: '1.200,5' })],
      })

      expectAnswerIsAccepted('1,200.5')
    })

    test('whitespaces are ignored', () => {
      createInputExercise({
        type: 'input-number-exact-match-challenge',
        answers: [createAnswer({ answer: '3/10' })],
      })

      expectAnswerIsAccepted(' 3 / 1 0')
    })

    test('ignore leading "+" sign', () => {
      createInputExercise({
        type: 'input-number-exact-match-challenge',
        answers: [createAnswer({ answer: '3' })],
      })

      expectAnswerIsAccepted('+3')
    })
  })

  describe('type = input-expression-equal-match-challenge', () => {
    beforeEach(() => {
      createInputExercise({
        type: 'input-expression-equal-match-challenge',
        answers: [createAnswer({ answer: '1+x^2' })],
      })
    })

    test('algebraic differences are ignored', () => {
      expectAnswerIsAccepted('x*x + 1')
    })

    test('ignore leading "+" sign (algebra.js cannot handle those signs)', () => {
      expectAnswerIsAccepted('+(1 + x^2)')
    })
  })

  function expectAnswerIsAccepted(answer: string) {
    submitAnswer(answer)

    expect(screen.getByText('Correct')).toBeVisible()
  }
})

function createInputExercise({
  answers,
  type = 'input-string-normalized-match-challenge',
}: {
  answers: ReturnType<typeof createAnswer>[]
  type?: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plugins: Record<string, EditorPlugin<any, any>> = {
    inputExercise: inputExercisePlugin,
    text: textPlugin,
  }

  const state = {
    plugin: 'inputExercise',
    state: { type, unit: '', answers },
  }

  render(<Renderer plugins={plugins} state={state} />)
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

function submitAnswer(answer: string) {
  const input = screen.getByPlaceholderText('Your solution')

  userEvent.clear(input)
  userEvent.type(input, answer)

  userEvent.click(screen.getByRole('button'))
}
