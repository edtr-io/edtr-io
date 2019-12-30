import { StateTypeSerializedType } from '@edtr-io/plugin'

import { TextState, createTextPlugin } from '../src'

export const name = 'text'
export const plugin = createTextPlugin({
  // registry: [
  //   {
  //     name: 'anchor'
  //   },
  //   {
  //     name: 'blockquote'
  //   },
  //   {
  //     name: 'equations'
  //   },
  //   {
  //     name: 'files'
  //   },
  //   {
  //     name: 'geogebra'
  //   },
  //   {
  //     name: 'highlight'
  //   },
  //   {
  //     name: 'hint'
  //   },
  //   {
  //     name: 'image'
  //   },
  //   {
  //     name: 'importantStatement'
  //   },
  //   {
  //     name: 'inputExercise'
  //   },
  //   {
  //     name: 'multimediaExplanation'
  //   },
  //   {
  //     name: 'scMcExercise'
  //   },
  //   {
  //     name: 'serloInjection'
  //   },
  //   {
  //     name: 'solution'
  //   },
  //   {
  //     name: 'spoiler'
  //   },
  //   {
  //     name: 'table'
  //   },
  //   {
  //     name: 'video'
  //   }
  // ]
})

export const states: Record<string, StateTypeSerializedType<TextState>> = {
  simple: [
    {
      type: 'paragraph',
      children: [{ text: 'Hello world' }]
    }
  ],
  strong: [
    {
      type: 'paragraph',
      children: [{ strong: true, text: 'bold' }]
    }
  ],
  color: [
    {
      type: 'paragraph',
      children: [{ color: 1, text: 'color' }]
    }
  ]
}
