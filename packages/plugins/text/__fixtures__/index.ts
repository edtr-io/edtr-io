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
      type: 'p',
      children: [{ text: 'Hello world' }]
    }
  ],
  strong: [
    {
      type: 'p',
      children: [{ strong: true, text: 'bold text' }]
    }
  ],
  em: [
    {
      type: 'p',
      children: [{ em: true, text: 'emphasized text' }]
    }
  ],
  link: [
    {
      type: 'p',
      children: [
        {
          type: 'a',
          href: 'https://edtr.io',
          children: [
            {
              text: 'Link to edtr.io'
            }
          ]
        }
      ]
    }
  ],
  color: [
    {
      type: 'p',
      children: [{ color: 1, text: 'color' }]
    }
  ],
  heading: [
    {
      type: 'h',
      level: 1,
      children: [
        {
          text: 'heading'
        }
      ]
    }
  ],
  math: [
    {
      type: 'math',
      src: '\\sum_{i=1}^n x^i',
      children: [{
        text: ''
      }]
    }
  ]
}
