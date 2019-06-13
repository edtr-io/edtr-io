import { Plugin } from '@edtr-io/core'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { equationsPlugin } from '@edtr-io/plugin-equations'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { h5pPlugin } from '@edtr-io/plugin-h5p'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { imagePlugin, readFile } from './plugin-image'
import {
  createFilePlugin,
  parseFileType,
  UploadedFile
} from '@edtr-io/plugin-files'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { textPlugin } from '@edtr-io/plugin-text'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { videoPlugin } from '@edtr-io/plugin-video'

const mockUploadFileHandler = (file: File): Promise<UploadedFile> => {
  return readFile(file).then(loaded => {
    return {
      location: loaded.dataUrl,
      name: loaded.file.name,
      type: parseFileType(loaded.file.name)
    }
  })
}

export const plugins: Record<string, Plugin> = {
  // Must be placed before files for onPaste
  image: imagePlugin,
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  equations: equationsPlugin,
  files: createFilePlugin({ upload: mockUploadFileHandler }),
  h5p: h5pPlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  inputExercise: inputExercisePlugin,
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  text: textPlugin,
  video: videoPlugin
}
