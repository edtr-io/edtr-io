import { imagePlugin, readFile } from '@edtr-io/internal__demo/src/plugin-image'
import { DeprecatedPlugin, EditorPlugin } from '@edtr-io/plugin'
import { createAnchorPlugin } from '@edtr-io/plugin-anchor'
import { createBlockquotePlugin } from '@edtr-io/plugin-blockquote'
import { createEquationsPlugin } from '@edtr-io/plugin-equations'
import {
  createFilesPlugin,
  parseFileType,
  UploadedFile
} from '@edtr-io/plugin-files'
import { createGeogebraPlugin } from '@edtr-io/plugin-geogebra'
import { createHighlightPlugin } from '@edtr-io/plugin-highlight'
import { createHintPlugin } from '@edtr-io/plugin-hint'
import { createInputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createRowsPlugin } from '@edtr-io/plugin-rows'
import { createScMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { createSolutionPlugin } from '@edtr-io/plugin-solution'
import { createSpoilerPlugin } from '@edtr-io/plugin-spoiler'
import { textPlugin } from '@edtr-io/plugin-text'
import { createVideoPlugin } from '@edtr-io/plugin-video'

const mockUploadFileHandler = (file: File): Promise<UploadedFile> => {
  return readFile(file).then(loaded => {
    return {
      location: loaded.dataUrl,
      name: loaded.file.name,
      type: parseFileType(loaded.file.name)
    }
  })
}

export const plugins: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorPlugin<any, any> | DeprecatedPlugin
> = {
  // Must be placed before files for onPaste
  image: imagePlugin,
  anchor: createAnchorPlugin(),
  blockquote: createBlockquotePlugin(),
  equations: createEquationsPlugin(),
  files: createFilesPlugin({ upload: mockUploadFileHandler }),
  geogebra: createGeogebraPlugin(),
  highlight: createHighlightPlugin(),
  hint: createHintPlugin(),
  inputExercise: createInputExercisePlugin(),
  rows: createRowsPlugin({ plugins: [] }),
  scMcExercise: createScMcExercisePlugin(),
  solution: createSolutionPlugin(),
  spoiler: createSpoilerPlugin(),
  text: textPlugin,
  video: createVideoPlugin()
}
