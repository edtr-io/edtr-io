import * as R from 'ramda'

import { HighlightConfig, HighlightPluginConfig } from '.'
import { HighlightRenderer } from './renderer'

export function useHighlightConfig(
  config: HighlightConfig
): HighlightPluginConfig {
  const { i18n = {}, Renderer = HighlightRenderer } = config

  return {
    i18n: R.mergeDeepRight(
      {
        code: {
          label: 'Click here and enter your source code…',
          placeholder: 'Enter your source code here',
        },
        language: {
          label: 'Language',
          placeholder: 'Enter language',
        },
        showLineNumbers: {
          label: 'Show line numbers',
        },
      },
      i18n
    ),
    Renderer,
  }
}
