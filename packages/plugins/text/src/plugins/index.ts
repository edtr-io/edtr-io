import { TextEditorPlugin } from '../types'
import { createEmMarkPlugin } from './em-mark'
import { createHoveringToolbarPlugin } from './hovering-toolbar'
import { createParagraphElementPlugin } from './paragraph-element'
import { createStrongMarkPlugin } from './strong-mark'

export const defaultPlugins: TextEditorPlugin[] = [
  createEmMarkPlugin(),
  createParagraphElementPlugin(),
  createStrongMarkPlugin(),
  createHoveringToolbarPlugin()
]
