import * as R from 'ramda'

import { SpoilerConfig, SpoilerPluginConfig } from '.'

export function useSpoilerConfig(config: SpoilerConfig): SpoilerPluginConfig {
  const { i18n = {}, theme = {} } = config

  return {
    i18n: R.mergeDeepRight(
      {
        title: {
          placeholder: 'Enter a title',
        },
      },
      i18n
    ),
    theme: {
      color: '#f5f5f5',
      ...theme,
    },
  }
}
