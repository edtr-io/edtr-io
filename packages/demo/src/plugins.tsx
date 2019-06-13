import { Plugin } from '@edtr-io/core'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { exercisePlugin } from '@edtr-io/plugin-exercise'
import { equationsPlugin } from '@edtr-io/plugin-equations'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { h5pPlugin } from '@edtr-io/plugin-h5p'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { createImagePlugin, ImageUploadConfig } from '@edtr-io/plugin-image'
import {
  createFilePlugin,
  FileUploadConfig,
  parseFileType
} from '@edtr-io/plugin-files'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { textPlugin } from '@edtr-io/plugin-text'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { videoPlugin } from '@edtr-io/plugin-video'

interface SerloResponse {
  files: { location: string; filename: string }[]
}

const baseUploadConfig = {
  url: 'https://de.serlo.org/attachment/upload',
  paramName: 'attachment[file]',
  maxFileSize: 2 * 1024 * 1024,
  getAdditionalFields: () => {
    return {
      type: 'file',
      csrf: ((window as unknown) as { csrf: string }).csrf
    }
  }
}
export const imageUploadConfig: ImageUploadConfig<SerloResponse> = {
  ...baseUploadConfig,
  allowedExtensions: ['gif', 'jpg', 'jpeg', 'png', 'svg'],
  getStateFromResponse: response => {
    return {
      src: response.files[0].location
    }
  }
}

export const fileUploadConfig: FileUploadConfig<SerloResponse> = {
  ...baseUploadConfig,
  getStateFromResponse: response => {
    return {
      location: response.files[0].location,
      name: response.files[0].filename,
      type: parseFileType(response.files[0].filename)
    }
  }
}

export const plugins: Record<string, Plugin> = {
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  exercise: exercisePlugin,
  equations: equationsPlugin,
  files: createFilePlugin({ upload: fileUploadConfig }),
  h5p: h5pPlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  image: createImagePlugin({
    upload: imageUploadConfig,
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
