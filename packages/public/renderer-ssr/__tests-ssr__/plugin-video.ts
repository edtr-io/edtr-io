import { plugins } from '@edtr-io/internal__fixtures'
import { StateTypeSerializedType } from '@edtr-io/internal__plugin-state'
import { VideoState } from '@edtr-io/plugin-video'

import { render } from '../src'

test('Video plugin', () => {
  const state: {
    plugin: string
    state: StateTypeSerializedType<VideoState>
  } = {
    plugin: 'video',
    state: {
      __version__: 1,
      value: {
        src: 'https://www.youtube.com/watch?v=SCJ7nzKwnYo',
        alt: 'Petworms'
      }
    }
  }
  const { html } = render({
    state,
    plugins
  })
  expect(html).toContain('youtube')
  expect(html).toContain('Petworms')
})
