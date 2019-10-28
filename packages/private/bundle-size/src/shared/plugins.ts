import { imagePlugin, readFile } from '@edtr-io/internal__demo/src/plugin-image'
import { Plugin } from '@edtr-io/plugin'
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
import { createImportantStatementPlugin } from '@edtr-io/plugin-important-statement'
import { createInputExercisePlugin } from '@edtr-io/plugin-input-exercise'
import { createRowsPlugin } from '@edtr-io/plugin-rows'
import { createScMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise'
import { createSerloInjectionPlugin } from '@edtr-io/plugin-serlo-injection'
import { createSolutionPlugin } from '@edtr-io/plugin-solution'
import { createSpoilerPlugin } from '@edtr-io/plugin-spoiler'
import { createTablePlugin } from '@edtr-io/plugin-table'
import { createTextPlugin } from '@edtr-io/plugin-text'
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

const registry = [
  // Must be placed before files for onPaste
  {
    name: 'image',
    ...imagePlugin
  },
  {
    name: 'anchor',
    ...createAnchorPlugin()
  },
  {
    name: 'blockquote',
    ...createBlockquotePlugin()
  },
  {
    name: 'equations',
    ...createEquationsPlugin()
  },
  {
    name: 'files',
    ...createFilesPlugin({ upload: mockUploadFileHandler })
  },
  {
    name: 'geogebra',
    ...createGeogebraPlugin()
  },
  {
    name: 'highlight',
    ...createHighlightPlugin()
  },
  {
    name: 'hint',
    ...createHintPlugin()
  },
  {
    name: 'inputExercise',
    ...createInputExercisePlugin()
  },
  {
    name: 'importantStatement',
    ...createImportantStatementPlugin()
  },
  {
    name: 'scMcExercise',
    ...createScMcExercisePlugin()
  },
  {
    name: 'serloInjection',
    ...createSerloInjectionPlugin()
  },
  {
    name: 'solution',
    ...createSolutionPlugin()
  },
  {
    name: 'spoiler',
    ...createSpoilerPlugin()
  },
  {
    name: 'table',
    ...createTablePlugin()
  },
  {
    name: 'video',
    ...createVideoPlugin()
  }
]

const textPlugin = createTextPlugin({
  registry
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const plugins: Record<string, Plugin<any, any>> = {
  rows: createRowsPlugin({
    plugins: [{ name: 'text', ...textPlugin }, ...registry]
  }),
  text: textPlugin
}

registry.forEach(({ name, ...plugin }) => {
  plugins[name] = plugin
})
