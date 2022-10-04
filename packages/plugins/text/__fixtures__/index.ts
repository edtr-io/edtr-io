import { StateTypeSerializedType } from '@edtr-io/plugin'

import { TextPluginState, createTextPlugin } from '../src'

export const name = 'text'
export const plugin = createTextPlugin({
  blockquote: 'blockquote',
  registry: [
    {
      name: 'anchor',
    },
    {
      name: 'blockquote',
    },
    {
      name: 'files',
    },
    {
      name: 'geogebra',
    },
    {
      name: 'highlight',
    },
    {
      name: 'image',
    },
    {
      name: 'inputExercise',
    },
    {
      name: 'multimediaExplanation',
    },
    {
      name: 'scMcExercise',
    },
    {
      name: 'serloInjection',
    },
    {
      name: 'spoiler',
    },
    {
      name: 'table',
    },
    {
      name: 'video',
    },
  ],
})

export const states: Record<
  string,
  StateTypeSerializedType<TextPluginState>
> = {
  simple: [
    {
      type: 'paragraph',
      children: [{ text: 'Hello world' }],
    },
  ],
  bold: [
    {
      type: 'paragraph',
      children: [{ strong: true, text: 'bold' }],
    },
  ],
  color: [
    {
      type: 'paragraph',
      children: [{ color: 0, text: 'color' }],
    },
  ],
  code: [
    {
      type: 'paragraph',
      children: [{ code: true, text: 'inline code' }],
    },
  ],
}
