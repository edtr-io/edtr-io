import { StateTypeSerializedType } from '@edtr-io/plugin'
import {
  createTextState,
  name as textPlugin,
    Text
} from '@edtr-io/plugin-text/__fixtures__'

import { ImportantStatementState, createImportantStatementPlugin } from '../src'

export const name = 'importantStatement'
export const plugin = createImportantStatementPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<ImportantStatementState>
> = {
  simple: {
    plugin: textPlugin,
    state: createTextState(
      Text.create({ text: 'This is an important statement' })
    )
  }
}
