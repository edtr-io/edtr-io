import { plugins } from '@edtr-io/fixtures'
import { StateType, StateTypeSerializedType } from '@edtr-io/plugin'
import { anchorState } from '@edtr-io/plugin-anchor'
import { blockquoteState } from '@edtr-io/plugin-blockquote'
import { geogebraState } from '@edtr-io/plugin-geogebra'
import { highlightState } from '@edtr-io/plugin-highlight'
import { hintState } from '@edtr-io/plugin-hint'
import { imageState } from '@edtr-io/plugin-image'
import { importantStatementState } from '@edtr-io/plugin-important-statement'
import { inputExerciseState } from '@edtr-io/plugin-input-exercise'
import { rowsState } from '@edtr-io/plugin-rows'
import { scMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionState } from '@edtr-io/plugin-serlo-injection'
import { solutionState } from '@edtr-io/plugin-solution'
import { spoilerState } from '@edtr-io/plugin-spoiler'
import { tableState } from '@edtr-io/plugin-table'
import { videoState } from '@edtr-io/plugin-video'

import { render } from '../src'

describe('Renderer SSR', () => {
  test('Anchor plugin', () => {
    const state: Document<typeof anchorState> = {
      plugin: 'anchor',
      state: 'foo'
    }
    render({
      state,
      plugins
    })
  })

  test('Blockquote plugin', () => {
    const state: Document<typeof blockquoteState> = {
      plugin: 'blockquote',
      state: {
        plugin: 'anchor',
        state: 'foo'
      }
    }
    render({
      state,
      plugins
    })
  })

  test('GeoGebra plugin', () => {
    const state: Document<typeof geogebraState> = {
      plugin: 'geogebra',
      state: 'foo'
    }
    render({
      state,
      plugins
    })
  })

  test('Highlight plugin', () => {
    const state: Document<typeof highlightState> = {
      plugin: 'highlight',
      state: {
        text: 'const el = <div />',
        language: 'javascript',
        lineNumbers: true
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Hint plugin', () => {
    const state: Document<typeof hintState> = {
      plugin: 'hint',
      state: {
        title: 'foo',
        content: {
          plugin: 'rows',
          state: []
        }
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Image plugin', () => {
    const state: Document<typeof imageState> = {
      plugin: 'image',
      state: {
        src: 'foo',
        href: '#',
        target: '',
        rel: '',
        description: 'foo bar',
        maxWidth: 0
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Important statement plugin', () => {
    const state: Document<typeof importantStatementState> = {
      plugin: 'important',
      state: {
        plugin: 'anchor',
        state: 'foo'
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Serlo injection plugin', () => {
    const state: Document<typeof serloInjectionState> = {
      plugin: 'injection',
      state: '1337'
    }
    render({
      state,
      plugins
    })
  })

  test('Input exercise plugin', () => {
    const state: Document<typeof inputExerciseState> = {
      plugin: 'inputExercise',
      state: {
        type: 'Text',
        wrongAnswers: [],
        correctAnswers: []
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Rows plugin', () => {
    const state: Document<typeof rowsState> = {
      plugin: 'rows',
      state: [
        {
          plugin: 'anchor',
          state: 'foo'
        }
      ]
    }
    render({
      state,
      plugins
    })
  })

  test('Sc-Mc exercise plugin', () => {
    const state: Document<typeof scMcExerciseState> = {
      plugin: 'scMcExercise',
      state: {
        isSingleChoice: true,
        answers: [
          {
            id: {
              plugin: 'anchor',
              state: 'foo'
            },
            isCorrect: true,
            feedback: {
              plugin: 'anchor',
              state: 'foo'
            },
            hasFeedback: true
          }
        ]
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Solution plugin', () => {
    const state: Document<typeof solutionState> = {
      plugin: 'solution',
      state: {
        title: 'foo',
        content: {
          plugin: 'rows',
          state: []
        }
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Spoiler plugin', () => {
    const state: Document<typeof spoilerState> = {
      plugin: 'spoiler',
      state: {
        title: 'foo',
        content: {
          plugin: 'rows',
          state: []
        }
      }
    }
    render({
      state,
      plugins
    })
  })

  test('Table plugin', () => {
    const state: Document<typeof tableState> = {
      plugin: 'spoiler',
      state: '| foo |'
    }
    render({
      state,
      plugins
    })
  })

  test('Video plugin', () => {
    const state: Document<typeof videoState> = {
      plugin: 'spoiler',
      state: '123'
    }
    render({
      state,
      plugins
    })
  })
})

interface Document<D extends StateType> {
  plugin: string
  state: StateTypeSerializedType<D>
}
