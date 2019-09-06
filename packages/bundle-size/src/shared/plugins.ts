import { imagePlugin, readFile } from '@edtr-io/demo/src/plugin-image'
import { Plugin } from '@edtr-io/plugin'
import { anchorPlugin } from '@edtr-io/plugin-anchor'
import { blockquotePlugin } from '@edtr-io/plugin-blockquote'
import { equationsPlugin } from '@edtr-io/plugin-equations'
import {
  createFilePlugin,
  parseFileType,
  UploadedFile
} from '@edtr-io/plugin-files'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { textPlugin } from '@edtr-io/plugin-text'
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
