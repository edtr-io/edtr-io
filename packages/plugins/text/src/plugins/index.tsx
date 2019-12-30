import { EdtrIcon, edtrBold, edtrItalic } from '@edtr-io/ui'
import * as React from 'react'

import { TextEditorPlugin } from '../types'
import { createEmMarkPlugin } from './em-mark'
import { createHoveringToolbarPlugin } from './hovering-toolbar'
import { createParagraphElementPlugin } from './paragraph-element'
import { createStrongMarkPlugin } from './strong-mark'

export const defaultPlugins: TextEditorPlugin[] = [
  createStrongMarkPlugin({
    control: {
      icon: <EdtrIcon icon={edtrBold} />,
      title: 'Fett (Strg + B)'
    }
  }),
  createEmMarkPlugin({
    control: {
      icon: <EdtrIcon icon={edtrItalic} />,
      title: 'Kursiv (Strg + I)'
    }
  }),
  createParagraphElementPlugin(),
  createHoveringToolbarPlugin()
]
