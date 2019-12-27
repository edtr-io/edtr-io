import { StateTypeSerializedType } from '@edtr-io/plugin'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { ImportantStatementState, createImportantStatementPlugin } from '../src'

export const name = 'importantStatement'
export const plugin = createImportantStatementPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<ImportantStatementState>
> = {
  simple: {
    plugin: textPlugin,
    state: [
      {
        type: 'paragraph',
        children: [{ text: 'This is an important statement' }]
      }
    ]
  }
}
