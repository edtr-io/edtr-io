import { StateTypeSerializedType } from '@edtr-io/plugin'

import { HighlightPluginState, createHighlightPlugin } from '../src'

export const name = 'highlight'
export const plugin = createHighlightPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<HighlightPluginState>
> = {
  javascript: {
    language: 'javascript',
    showLineNumbers: true,
    code: "console.log('Hello World')",
  },
}
