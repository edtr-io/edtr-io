import { StateTypeSerializedType } from '@edtr-io/plugin'

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
  simple: [
    {
      type: 'p',
      children: [{ text: 'Hello world' }]
    }
  ],
  bold: [
    {
      type: 'p',
      children: [{ strong: true, text: 'bold' }]
    }
  ],
  color: [
    {
      type: 'p',
      children: [{ color: 0, text: 'color' }]
    }
  ]
}
