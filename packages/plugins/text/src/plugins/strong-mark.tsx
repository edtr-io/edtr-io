import isHotkey from 'is-hotkey'
import * as React from 'react'

import { isMarkActive, toggleMark } from '../helpers'
import { Editor, TextEditorControl, TextEditorPlugin } from '../types'

export function createStrongMarkPlugin({
  control,
  type = 'strong',
  Component = StrongMark,
  hotkey = 'mod+b'
}: {
  control?: Pick<TextEditorControl, 'icon' | 'title'>
  type?: string
  Component?: React.ComponentType<{ children: React.ReactNode }>
  hotkey?: string | ReadonlyArray<string>
} = {}): TextEditorPlugin {
  return (editor: Editor) => {
    const { controls, onKeyDown, renderLeaf } = editor
    editor.onKeyDown = event => {
      if (!isHotkey(hotkey, event)) return onKeyDown(event)
      toggleMark(editor, type)
    }
    // eslint-disable-next-line react/display-name
    editor.renderLeaf = ({ children, ...props }) => {
      const Wrapper = props.leaf[type] ? Component : React.Fragment
      return renderLeaf({ ...props, children: <Wrapper>{children}</Wrapper> })
    }
    if (control) {
      editor.controls = [
        ...controls,
        {
          ...control,
          isActive() {
            return isMarkActive(editor, type)
          },
          onClick() {
            toggleMark(editor, type)
          }
        }
      ]
    }

    return editor
  }
}

function StrongMark({ children }: { children: React.ReactNode }) {
  return <strong>{children}</strong>
}
