import * as R from 'ramda'

import { VideoConfig, VideoPluginConfig } from '.'

export function useVideoConfig(config: VideoConfig): VideoPluginConfig {
  const { i18n = {} } = config

  return {
    i18n: R.mergeDeepRight(
      {
        src: {
          label: 'Video URL',
        },
        alt: {
          label: 'Description',
        },
      },
      i18n
    ),
  }
}
