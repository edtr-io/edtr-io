import * as React from 'react'
import { Element } from 'slate'
import { RenderElementProps } from 'slate-react'

import { TextEditorPlugin } from '../types'
import { createBlockElementPlugin } from './block-element'

export function createHeadingElementPlugin({
  control,
  type = 'h',
  Component = Heading
}: {
  control?: {
    icon: React.ReactNode
    levels: {
      [P in HeadingElement['level']]?: {
        icon: React.ReactNode
        title: string
      }
    }
    title: string
    resetIcon: React.ReactNode
    resetTitle: string
  }
  type?: string
  Component?: React.ComponentType<
    RenderElementProps & { element: HeadingElement }
  >
} = {}): TextEditorPlugin {
  return createBlockElementPlugin<HeadingElement>(
    {
      type,
      Component
    },
    (editor, { isActive, getElement, remove, set }) => {
      const { controls } = editor
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
            children: [
              {
                title: control.resetTitle,
                renderIcon() {
                  return control.resetIcon
                },
                isActive() {
                  return !isActive()
                },
                onClick() {
                  remove()
                }
              },
              ...([1, 2, 3, 4, 5, 6] as HeadingElement['level'][])
                .filter(level => {
                  return control.levels[level] !== undefined
                })
                .map(level => {
                  const levelControl = control.levels[level] as {
                    icon: React.ReactNode
                    title: string
                  }
                  return {
                    title: levelControl.title,
                    renderIcon() {
                      return levelControl.icon
                    },
                    isActive() {
                      const element = getElement()
                      return element !== undefined && element.level === level
                    },
                    onClick() {
                      toggle(level)
                    }
                  }
                })
            ]
          }
        ]
      }

      return editor

      function toggle(level: HeadingElement['level']) {
        const element = getElement()
        const active = element !== undefined && element.level === level
        active ? remove() : set({ level })
      }
    }
  )
}

export interface HeadingElement extends Element {
  level: 1 | 2 | 3 | 4 | 5 | 6
}

function Heading({
  attributes,
  element,
  children
}: RenderElementProps & { element: HeadingElement }) {
  return React.createElement(`h${element.level}`, attributes, children)
}
