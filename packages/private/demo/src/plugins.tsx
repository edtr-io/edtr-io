import { EditorPlugin } from '@edtr-io/plugin'
import { plugin as anchorPlugin } from '@edtr-io/plugin-anchor/__fixtures__'
import { plugin as blockquotePlugin } from '@edtr-io/plugin-blockquote/__fixtures__'
import { plugin as filesPlugin } from '@edtr-io/plugin-files/__fixtures__'
import { plugin as geogebraPlugin } from '@edtr-io/plugin-geogebra/__fixtures__'
import { plugin as highlightPlugin } from '@edtr-io/plugin-highlight/__fixtures__'
import { plugin as imagePlugin } from '@edtr-io/plugin-image/__fixtures__'
import { plugin as importantStatementPlugin } from '@edtr-io/plugin-important-statement/__fixtures__'
import { plugin as inputExercisePlugin } from '@edtr-io/plugin-input-exercise/__fixtures__'
import { plugin as multimediaExplanationPlugin } from '@edtr-io/plugin-multimedia-explanation/__fixtures__'
import { plugin as rowsPlugin } from '@edtr-io/plugin-rows/__fixtures__'
import { plugin as scMcExercisePlugin } from '@edtr-io/plugin-sc-mc-exercise/__fixtures__'
import { plugin as serloInjectionPlugin } from '@edtr-io/plugin-serlo-injection/__fixtures__'
import { plugin as solutionPlugin } from '@edtr-io/plugin-solution/__fixtures__'
import { plugin as spoilerPlugin } from '@edtr-io/plugin-spoiler/__fixtures__'
import { plugin as tablePlugin } from '@edtr-io/plugin-table/__fixtures__'
import { plugin as textPlugin } from '@edtr-io/plugin-text/__fixtures__'
import { plugin as videoPlugin } from '@edtr-io/plugin-video/__fixtures__'

export const plugins: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EditorPlugin<any, any>
> = {
  // Must be placed before files for onPaste
  image: imagePlugin,
  anchor: anchorPlugin,
  blockquote: blockquotePlugin,
  files: filesPlugin,
  geogebra: geogebraPlugin,
  highlight: highlightPlugin,
  importantStatement: importantStatementPlugin,
  inputExercise: inputExercisePlugin,
  multimediaExplanation: multimediaExplanationPlugin,
  rows: rowsPlugin,
  scMcExercise: scMcExercisePlugin,
  serloInjection: serloInjectionPlugin,
  solution: solutionPlugin,
  spoiler: spoilerPlugin,
  table: tablePlugin,
  text: textPlugin,
  video: videoPlugin
}
