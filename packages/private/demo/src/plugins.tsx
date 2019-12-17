import { DeprecatedPlugin, EditorPlugin } from '@edtr-io/plugin'
import { createAnchorPlugin } from '@edtr-io/plugin-anchor'
import { createBlockquotePlugin } from '@edtr-io/plugin-blockquote'
import { createEquationsPlugin } from '@edtr-io/plugin-equations'
import {
  createFilesPlugin,
  parseFileType,
  UploadedFile
} from '@edtr-io/plugin-files'
import { geogebraPlugin } from '@edtr-io/plugin-geogebra'
import { highlightPlugin } from '@edtr-io/plugin-highlight'
import { hintPlugin } from '@edtr-io/plugin-hint'
import { importantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { inputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createMultimediaExplanationPlugin } from '@edtr-io/plugin-multimedia-explanation'
import { createRowsPlugin, rowsPlugin } from '@edtr-io/plugin-rows'
import { scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { solutionPlugin } from '@edtr-io/plugin-solution'
import { spoilerPlugin } from '@edtr-io/plugin-spoiler'
import { tablePlugin } from '@edtr-io/plugin-table'
import { createTextPlugin, textPlugin } from '@edtr-io/plugin-text'
import { videoPlugin } from '@edtr-io/plugin-video'

import { imagePlugin, readFile } from './plugin-image'

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
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  hint: hintPlugin,
  inputExercise: inputExercisePlugin,
  importantStatement: importantStatementPlugin,
  multimediaExplanation: createMultimediaExplanationPlugin([
    {
      ...imagePlugin,
      name: 'image'
    },
    {
      ...videoPlugin,
      name: 'video'
    },
    {
      ...geogebraPlugin,
      name: 'geogebra'
    }
  ]),
  rows: rowsPlugin,
  customRows: createRowsPlugin([
    {
      ...textPlugin,
      name: 'text'
    },
    {
      ...imagePlugin,
      name: 'image'
    }
  ]),
  scMcExercise: scMcExercisePlugin,
  serloInjection: serloInjectionPlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  table: tablePlugin,
  text: textPlugin,
  customText: createTextPlugin([
    {
      ...textPlugin,
      name: 'text'
    },
    {
      ...imagePlugin,
      name: 'image'
    }
  ]),
  video: videoPlugin
}
