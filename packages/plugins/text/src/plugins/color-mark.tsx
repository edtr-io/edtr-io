import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { TextEditorPlugin } from '../types'
import { createMarkPlugin } from './mark'

const ColorMark = styled.span<{ color: string }>(({ color }) => {
  return {
    color
  }
})

export function createColorMarkPlugin({
  control,
  colors = ['#1794c1', '#469a40', '#ff6703'],
  defaultColor = '#000000',
  type = 'color',
  Component = ColorMark
}: {
  control?: {
    Icon: React.ComponentType<{ color: string }>
    ColorIcon: React.ComponentType<{ color: string }>
    title: string
    colorTitle: string
    resetColorTitle: string
  }
  colors?: string[]
  defaultColor?: string
  type?: string
  Component?: React.ComponentType<{ children: React.ReactNode; color: string }>
} = {}): TextEditorPlugin {
  return createMarkPlugin<number>(
    {
      Component: function ColorMark({ value, children }) {
        const color = colors[value % colors.length]
        return <Component color={color}>{children}</Component>
      },
      type
    },
    (editor, { isActive, getValue, remove, toggle }) => {
      const { controls } = editor

      if (control) {
        editor.controls = [
          ...controls,
          {
            renderIcon() {
              const value = getValue()
              const color = value ? getColor(value) : defaultColor
              return <control.Icon color={color} />
            },
            title: control.title,
            children: [
              {
                title: control.resetColorTitle,
                renderIcon() {
                  return <control.ColorIcon color={defaultColor} />
                },
                isActive() {
                  return !isActive()
                },
                onClick() {
                  return remove()
                }
              },
              ...colors.map((color, value) => {
                return {
                  title: control.colorTitle,
                  renderIcon() {
                    return <control.ColorIcon color={color} />
                  },
                  isActive() {
                    return isActive(value)
                  },
                  onClick() {
                    toggle(value)
                  }
                }
              })
            ]
          }
        ]
      }

      return editor
    }
  )

  function getColor(value: number) {
    return colors[value % colors.length]
  }
}
