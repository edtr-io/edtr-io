import { StateTypeSerializedType } from '@edtr-io/plugin'

import { VideoPluginState, createVideoPlugin } from '../src'

export const name = 'video'
export const plugin = createVideoPlugin()

export const states: Record<
  string,
  StateTypeSerializedType<VideoPluginState>
> = {
  simple: {
    src: 'https://www.youtube.com/watch?v=SCJ7nzKwnYo',
    alt: 'Regenwürmer als Haustiere'
  }
}
