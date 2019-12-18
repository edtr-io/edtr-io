import { ThemeProps, styled } from '@edtr-io/ui'
import * as React from 'react'
import { Editor } from 'slate'

import { SlatePluginClosure } from '../factory/types'
import { getTrimmedSelectionRange } from '../helpers'
import { colorMark } from '../model'
import {
  createTextPluginTheme,
  MarkEditorProps,
  MarkRendererProps,
  TextPlugin
} from '..'

export interface ColorPluginOptions {
  EditorComponent?: React.ComponentType<
    MarkEditorProps & { colorIndex: number; name: string }
  >
  RenderComponent?: React.ComponentType<
    MarkRendererProps & { colorIndex: number; name: string }
  >
}

const getActiveMarks = (editor: Editor) => {
  return editor.value.document.getActiveMarksAtRange(
    getTrimmedSelectionRange(editor)
  )
}

export const createIsColor = (colorIndex?: number) => (editor: Editor) => {
  return getActiveMarks(editor).some(mark => {
    if (!mark) {
      return false
    }
    if (typeof colorIndex === 'undefined') {
      return mark.type === colorMark
    }

    return mark.type === colorMark && mark.data.get('colorIndex') == colorIndex
  })
}

export const removeColor = (editor: Editor) => {
  return editor.value.marks
    .toArray()
    .filter(mark => mark.type === colorMark)
    .reduce((changedEditor, mark) => editor.removeMark(mark), editor)
}

export const createToggleColor = (colorIndex: number) => (editor: Editor) => {
  if (createIsColor(colorIndex)(editor)) {
    return removeColor(editor)
  }
  return removeColor(editor).addMark({
    type: colorMark,
    data: { colorIndex }
  })
}

export const getColorIndex = (editor: Editor) => {
  if (!createIsColor()(editor)) {
    return undefined
  } else {
    const mark = getActiveMarks(editor).find(mark =>
      mark ? mark.type === colorMark : false
    )
    return mark.data.get('colorIndex')
  }
}

const Color = styled.span(
  (props: ThemeProps & { name: string; colorIndex: number }) => {
    const theme = createTextPluginTheme(props.name, props.theme)
    const colors = theme.plugins.colors.colors
    return {
      color: colors[props.colorIndex % colors.length]
    }
  }
)

class DefaultEditorComponent extends React.Component<
  MarkEditorProps & { colorIndex: number; name: string }
> {
  public render() {
    const { attributes, children, colorIndex, name } = this.props
    return (
      <Color colorIndex={colorIndex} name={name} {...attributes}>
        {children}
      </Color>
    )
  }
}

export const createColorPlugin = ({
  EditorComponent = DefaultEditorComponent
}: ColorPluginOptions = {}) => (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  // TODO: deserialize
  return {
    renderMark(props, _editor, next) {
      const name = pluginClosure.current ? pluginClosure.current.name : ''
      const { mark } = props
      if (mark.object === 'mark' && mark.type === colorMark) {
        const colorIndex = mark.data.get('colorIndex')
        return (
          <EditorComponent colorIndex={colorIndex} {...props} name={name} />
        )
      }
      return next()
    }
  }
}
