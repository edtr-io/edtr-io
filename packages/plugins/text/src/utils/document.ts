import { StateTypeValueType } from '@edtr-io/plugin'

import { TextPluginState } from '../types'

export const emptyDocumentFactory =
  (): StateTypeValueType<TextPluginState> => ({
    value: [{ type: 'p', children: [{ text: '' }] }],
    selection: null,
  })
