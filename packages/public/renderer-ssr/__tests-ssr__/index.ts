import { plugins } from '@edtr-io/internal__fixtures'
import { StateType, StateTypeSerializedType } from '@edtr-io/plugin'
import { anchorState } from '@edtr-io/plugin-anchor'
import { blockquoteState } from '@edtr-io/plugin-blockquote'
import { geogebraState } from '@edtr-io/plugin-geogebra'
import { highlightState } from '@edtr-io/plugin-highlight'
import { hintState } from '@edtr-io/plugin-hint'
import { imageState } from '@edtr-io/plugin-image'
import { importantStatementState } from '@edtr-io/plugin-important-statement'
import { inputExerciseState } from '@edtr-io/plugin-input-exercise'
import { MultimediaExplanationState } from '@edtr-io/plugin-multimedia-explanation'
import { rowsState } from '@edtr-io/plugin-rows'
import { scMcExerciseState } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionState } from '@edtr-io/plugin-serlo-injection'
import { solutionState } from '@edtr-io/plugin-solution'
import { spoilerState } from '@edtr-io/plugin-spoiler'
import { tableState } from '@edtr-io/plugin-table'
import { textState } from '@edtr-io/plugin-text'
import { videoState } from '@edtr-io/plugin-video'
import { Mark, Text } from 'slate'

import { render } from '../src'

describe('Renderer SSR', () => {
  test('Anchor plugin', () => {
    const state: Document<typeof anchorState> = {
      plugin: 'anchor',
      state: 'foo'
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('<a')
    expect(html).toContain('id="foo"')
  })

  test('Blockquote plugin', () => {
    const state: Document<typeof blockquoteState> = {
      plugin: 'blockquote',
      state: {
        plugin: 'anchor',
        state: 'foo'
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('<blockquote')
  })

  test('GeoGebra plugin', () => {
    const state: Document<typeof geogebraState> = {
      plugin: 'geogebra',
      state: 'foo'
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('geogebra')
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
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('const')
  })

  test('Hint plugin', () => {
    const state: Document<typeof hintState> = {
      plugin: 'hint',
      state: {
        title: '',
        content: {
          plugin: 'rows',
          state: []
        }
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('Tipp')
    expect(html).toContain('anzeigen')
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
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('<img')
  })

  test('Important statement plugin', () => {
    const state: Document<typeof importantStatementState> = {
      plugin: 'important',
      state: {
        plugin: 'anchor',
        state: 'foo'
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('foo')
  })

  test('Serlo injection plugin', () => {
    const state: Document<typeof serloInjectionState> = {
      plugin: 'injection',
      state: '1337'
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('<iframe')
  })

  test('Input exercise plugin', () => {
    const state: Document<typeof inputExerciseState> = {
      plugin: 'inputExercise',
      state: {
        __version__: 1,
        value: {
          type: 'Text',
          answers: [
            {
              value: 'Apfel',
              isCorrect: true,
              feedback: {
                plugin: 'text',
                state: createTextState([Text.create({ text: 'feedback' })])
              }
            }
          ]
        }
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('<input')
  })

  test('Multimedia explanation plugin', () => {
    const state: Document<MultimediaExplanationState> = {
      plugin: 'multimediaExplanation',
      state: {
        illustrating: true,
        explanation: {
          plugin: 'rows',
          state: [
            {
              plugin: 'text',
              state: createTextState([
                Text.create({ text: 'This will be rendered' })
              ])
            }
          ]
        },
        multimedia: {
          plugin: 'image',
          state: {
            src: 'foo',
            href: '#',
            target: '',
            rel: '',
            description: 'foo bar',
            maxWidth: 0
          }
        },
        width: 50
      }
    }

    const { html } = render({ state, plugins })
    expect(html).toContain('This will be rendered')
    expect(html).toContain('<img')
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
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('foo')
  })

  test('Sc-Mc exercise plugin', () => {
    const state: Document<typeof scMcExerciseState> = {
      plugin: 'scMcExercise',
      state: {
        isSingleChoice: true,
        answers: [
          {
            id: {
              plugin: 'text',
              state: createTextState([Text.create({ text: 'option a' })])
            },
            isCorrect: true,
            feedback: {
              plugin: 'text',
              state: createTextState([Text.create({ text: 'feedback' })])
            },
            hasFeedback: true
          }
        ]
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('option a')
  })

  test('Solution plugin', () => {
    const state: Document<typeof solutionState> = {
      plugin: 'solution',
      state: {
        title: '',
        content: {
          plugin: 'rows',
          state: []
        }
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('Lösung')
    expect(html).toContain('anzeigen')
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
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('foo')
  })

  test('Table plugin', () => {
    const state: Document<typeof tableState> = {
      plugin: 'table',
      state: '| foo |\n|-|'
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('<table')
  })

  test('Text plugin', () => {
    const state: Document<typeof textState> = {
      plugin: 'text',
      state: createTextState([
        Text.create({ text: 'This will be rendered' }),
        Text.create({
          text: 'bold',
          marks: Mark.createSet(['@splish-me/strong'])
        })
      ])
    }
    const { html } = render({
      state,
      plugins
    })

    expect(html).toContain('This will be rendered')
    expect(html).toContain('<strong')
  })

  test('Text plugin with colors', () => {
    const state: Document<typeof textState> = {
      plugin: 'text',
      state: createTextState([
        Text.create({
          text: 'This is colored',
          marks: Mark.createSet([
            { type: '@splish-me/color', data: { colorIndex: 1 } }
          ])
        })
      ])
    }

    const { html } = render({
      state,
      plugins
    })

    expect(html).toContain('This is colored')
  })

  test('Video plugin', () => {
    const state: Document<typeof videoState> = {
      plugin: 'video',
      state: {
        __version__: 1,
        value: {
          src: 'https://www.youtube.com/watch?v=SCJ7nzKwnYo',
          alt: 'Petworms'
        }
      }
    }
    const { html } = render({
      state,
      plugins
    })
    expect(html).toContain('youtube')
    expect(html).toContain('Petworms')
  })
})

interface Document<D extends StateType> {
  plugin: string
  state: StateTypeSerializedType<D>
}

function createTextState(
  texts: Text[]
): StateTypeSerializedType<typeof textState> {
  return {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          data: {},
          nodes: texts.map(text => text.toJSON())
        }
      ]
    }
  }
}
