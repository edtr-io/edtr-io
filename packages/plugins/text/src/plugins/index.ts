import { TextEditorPlugin } from '../types'
import { createEmMarkPlugin } from './em-mark'
import { createParagraphElement } from './paragraph-element'
import { createStrongMarkPlugin } from './strong-mark'

export const defaultPlugins: TextEditorPlugin[] = [
  createEmMarkPlugin(),
  createParagraphElement(),
  createStrongMarkPlugin()
]
