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
    test('when answer is correct', async () => {
      await submitAnswer('right solution')

      expect(screen.getByText('Correct')).toBeVisible()
    })

    test('when answer is false', async () => {
      await submitAnswer('wrong answer')

      expect(screen.getByText('Wrong')).toBeVisible()
    })
  })

  test('submit button changes text when answer is correct', async () => {
    await submitAnswer('right solution')

    expect(screen.getByText('Stimmt!')).toBeVisible()
  })

  describe('shows result of the last submitted answer', () => {
    test('when last answer is correct', async () => {
      await submitAnswer('wrong answer')
      await submitAnswer('right solution')

      expect(screen.getByText('Correct')).toBeVisible()
    })

    test('when last answer is false', async () => {
      await submitAnswer('right solution')
      await submitAnswer('wrong answer')

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

  test('shows feedback of correct input when it is predefined', async () => {
    await submitAnswer('right solution')

    expect(screen.getByText('Correct answer!')).toBeVisible()
  })

  test('shows feedback of wrong input when it is predefined', async () => {
    await submitAnswer('wrong solution')

    expect(screen.getByText('Wrong answer!')).toBeVisible()
  })

  test('shows default feedback when answer is not in the list', async () => {
    await submitAnswer('another wrong solution')

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

    test('wrong whitespaces are ignored', async () => {
      await expectAnswerIsAccepted('   Right   Solution   ')
    })

    test('differences in lower and upper case are ignored', async () => {
      await expectAnswerIsAccepted('rIGHT sOLUTION')
    })
  })

  describe('type = input-number-exact-match-challenge', () => {
    test('differences between "," and "." are ignored', async () => {
      createInputExercise({
        type: 'input-number-exact-match-challenge',
        answers: [createAnswer({ answer: '1.200,5' })],
      })

      await expectAnswerIsAccepted('1,200.5')
    })

    test('whitespaces are ignored', async () => {
      createInputExercise({
        type: 'input-number-exact-match-challenge',
        answers: [createAnswer({ answer: '3/10' })],
      })

      await expectAnswerIsAccepted(' 3 / 1 0')
    })

    test('ignore leading "+" sign', async () => {
      createInputExercise({
        type: 'input-number-exact-match-challenge',
        answers: [createAnswer({ answer: '3' })],
      })

      await expectAnswerIsAccepted('+3')
    })
  })

  describe('type = input-expression-equal-match-challenge', () => {
    beforeEach(() => {
      createInputExercise({
        type: 'input-expression-equal-match-challenge',
        answers: [createAnswer({ answer: '1+x^2' })],
      })
    })

    test('algebraic differences are ignored', async () => {
      await expectAnswerIsAccepted('x*x + 1')
    })

    test('ignore leading "+" sign (algebra.js cannot handle those signs)', async () => {
      await expectAnswerIsAccepted('+(1 + x^2)')
    })
  })

  async function expectAnswerIsAccepted(answer: string) {
    await submitAnswer(answer)

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

async function submitAnswer(answer: string) {
  const input = screen.getByPlaceholderText('Your solution')

  await userEvent.clear(input)
  await userEvent.type(input, answer)

  await userEvent.click(screen.getByRole('button'))
}
