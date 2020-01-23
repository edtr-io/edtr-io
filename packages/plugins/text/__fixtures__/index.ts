import { StateTypeSerializedType } from '@edtr-io/plugin'
import { Mark, Text } from 'slate'

import { TextState, createTextPlugin } from '../src'

export const name = 'text'
export const plugin = createTextPlugin({
  blockquote: 'blockquote',
  registry: [
    {
      name: 'anchor'
    },
    {
      name: 'blockquote'
    },
    {
      name: 'files'
    },
    {
      name: 'geogebra'
    },
    {
      name: 'highlight'
    },
    {
      name: 'image'
    },
    {
      name: 'inputExercise'
    },
    {
      name: 'multimediaExplanation'
    },
    {
      name: 'scMcExercise'
    },
    {
      name: 'serloInjection'
    },
    {
      name: 'spoiler'
    },
    {
      name: 'table'
    },
    {
      name: 'video'
    }
  ]
})

export const states: Record<string, StateTypeSerializedType<TextState>> = {
  simple: createTextState(Text.create({ text: 'Hello world' })),
  bold: createTextState(
    Text.create({
      text: 'bold',
      marks: Mark.createSet(['@splish-me/strong'])
    })
  ),
  color: createTextState(
    Text.create({
      text: 'color',
      marks: Mark.createSet([
        { type: '@splish-me/color', data: { colorIndex: 1 } }
      ])
    })
  )
}

export function createTextState(
  ...args: Text[]
): StateTypeSerializedType<TextState> {
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
          nodes: args.map(text => text.toJSON())
        }
      ]
    }
  }
}

export * from 'slate'
