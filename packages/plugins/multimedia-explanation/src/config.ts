import * as R from 'ramda'

import {
  MultimediaExplanationConfig,
  MultimediaExplanationPluginConfig,
} from '.'

export function useMultimediaExplanationConfig(
  config: MultimediaExplanationConfig
): MultimediaExplanationPluginConfig {
  const {
    i18n = {},
    features = {
      importance: true,
    },
    plugins,
  } = config

  return {
    plugins,
    i18n: R.mergeDeepRight(
      {
        reset: 'Reset the multimedia content',
        changeMultimediaType: 'Change the multimedia type',
        illustrating: {
          label: 'How important is the multimedia content?',
          values: {
            illustrating: 'It is an illustrating',
            explaining: 'It is essential',
          },
        },
      },
      i18n
    ),
    features: R.mergeDeepRight(
      {
        link: false,
        importance: false,
      },
      features
    ),
  }
}
