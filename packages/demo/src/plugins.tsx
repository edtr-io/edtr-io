import { Plugin } from '@edtr-io/core'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { createImagePlugin, UploadConfig } from '@edtr-io/plugin-image'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { textPlugin } from '@edtr-io/plugin-text'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { videoPlugin } from '@edtr-io/plugin-video'

interface SerloResponse {
  files: { location: string }[]
}
const uploadConfig: UploadConfig<SerloResponse> = {
  url: 'https://de.serlo.org/attachment/upload',
  paramName: 'attachment[file]',
  maxFileSize: 2 * 1024 * 1024,
  allowedExtensions: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
  getAdditionalFields: () => {
    return {
      type: 'file',
      csrf: ((window as unknown) as { csrf: string }).csrf
    }
  },
  getStateFromResponse: response => {
    return {
      src: response.files[0].location
    }
  }
}

export const plugins: Record<string, Plugin> = {
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  highlight: highlightPlugin,
  image: createImagePlugin({ upload: uploadConfig }),
  rows: rowsPlugin,
  spoiler: spoilerPlugin,
  text: textPlugin,
  geogebra: geogebraPlugin,
  video: videoPlugin
}
