import { StateTypeSerializedType } from '@edtr-io/plugin'

import { HighlightState, createHighlightPlugin } from '../src'

export const name = 'highlight'
export const plugin = createHighlightPlugin()

export const states: Record<string, StateTypeSerializedType<HighlightState>> = {
  javascript: {
    language: 'javascript',
    lineNumbers: true,
    text: "console.log('Hello World')"
  }
}
