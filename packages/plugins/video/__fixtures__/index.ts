import { StateTypeSerializedType } from '@edtr-io/plugin'

import { VideoState, createVideoPlugin } from '../src'

export const name = 'video'
export const plugin = createVideoPlugin()

export const states: Record<string, StateTypeSerializedType<VideoState>> = {
  simple: {
    __version__: 1,
    value: {
      src: 'https://www.youtube.com/watch?v=SCJ7nzKwnYo',
      alt: 'Regenwürmer als Haustiere'
    }
  }
}
