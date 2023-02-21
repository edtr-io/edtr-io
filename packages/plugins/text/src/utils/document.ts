import { StateTypeValueType } from '@edtr-io/plugin'

import type { TextEditorState } from '../types'

export const emptyDocumentFactory =
  (): StateTypeValueType<TextEditorState> => ({
    value: [{ type: 'p', children: [{ text: '' }] }],
    selection: null,
  })
