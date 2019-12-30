import isHotkey from 'is-hotkey'
import * as React from 'react'

import { TextEditorPlugin } from '../types'
import { createMarkPlugin } from './mark'

export function createStrongMarkPlugin({
  control,
  type = 'strong',
  Component = StrongMark,
  hotkey = 'mod+b'
}: {
  control?: {
    title: string
    icon: React.ReactNode
  }
  type?: string
  Component?: React.ComponentType<{ children: React.ReactNode }>
  hotkey?: string | ReadonlyArray<string>
} = {}): TextEditorPlugin {
  return createMarkPlugin<true>(
    {
      Component: function StrongMark({ children }) {
        return <Component>{children}</Component>
      },
      type
    },
    (editor, { isActive, toggle }) => {
      const { controls, onKeyDown } = editor
      editor.onKeyDown = event => {
        if (!isHotkey(hotkey, event)) return onKeyDown(event)
        toggle(true)
      }
      if (control) {
        editor.controls = [
          ...controls,
          {
            title: control.title,
            renderIcon() {
              return control.icon
            },
            isActive() {
              return isActive()
            },
            onClick() {
              toggle(true)
            }
          }
        ]
      }

      return editor
    }
  )
}

function StrongMark({ children }: { children: React.ReactNode }) {
  return <strong>{children}</strong>
}
