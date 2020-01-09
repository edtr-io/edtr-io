import React from 'react'
import { Range } from 'slate'
import { useSlate } from 'slate-react'

import { Editor, TextConfig } from './types'

export function isCollapsed(editor: Editor) {
  return editor.selection && Range.isCollapsed(editor.selection)
}

export function useEditor(): Editor {
  return useSlate() as Editor
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ConfigContext = React.createContext<TextConfig>(undefined as any)

export function useConfig(): TextConfig {
  return React.useContext(ConfigContext)
}
