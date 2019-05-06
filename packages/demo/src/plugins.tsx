import { Plugin } from '@edtr-io/core'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { equationsPlugin } from '@edtr-io/plugin-equations'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { h5pPlugin } from '@edtr-io/plugin-h5p'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { createImagePlugin, UploadConfig } from '@edtr-io/plugin-image'
import { createFilePlugin} from '@edtr-io/plugin-files'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { textPlugin } from '@edtr-io/plugin-text'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { videoPlugin } from '@edtr-io/plugin-video'

interface SerloResponse {
  files: { location: string }[]
}
export const uploadConfig: UploadConfig<SerloResponse> = {
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
  equations: equationsPlugin,
  files: createFilePlugin({ upload: uploadConfig }),
  h5p: h5pPlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  image: createImagePlugin({
    upload: uploadConfig,
    secondInput: 'description'
  }),
  inputExercise: inputExercisePlugin,
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  text: textPlugin,
  video: videoPlugin
}
