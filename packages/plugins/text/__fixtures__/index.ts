import { StateTypeSerializedType } from '@edtr-io/plugin'

import { createTextPlugin } from '../src'
import { TextEditorControl, TextEditorState } from '../src/types'

export const name = 'text'
export const plugin = createTextPlugin({
  blockquote: 'blockquote',
  controls: [
    TextEditorControl.richText,
    TextEditorControl.links,
    TextEditorControl.headings,
    TextEditorControl.colors,
    TextEditorControl.lists,
    TextEditorControl.math,
    TextEditorControl.code,
  ],
})

export const states: Record<
  string,
  StateTypeSerializedType<TextEditorState>
> = {
  simple: [
    {
      type: 'p',
      children: [{ text: 'Hello world' }],
    },
  ],
  bold: [
    {
      type: 'p',
      children: [{ strong: true, text: 'bold' }],
    },
  ],
  color: [
    {
      type: 'p',
      children: [{ color: 0, text: 'color' }],
    },
  ],
  code: [
    {
      type: 'p',
      children: [{ code: true, text: 'inline code' }],
    },
  ],
}
