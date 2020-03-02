import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { Editor as CoreEditor } from 'slate'
import { Editor } from 'slate-react'

import {
  MarkEditorProps,
  MarkRendererProps,
  TextPluginConfig,
  TextPlugin
} from '..'
import { SlatePluginClosure } from '../factory/types'
import { getTrimmedSelectionRange } from '../helpers'
import { colorMark } from '../model'

export interface ColorPluginOptions {
  EditorComponent?: React.ComponentType<
    MarkEditorProps & { colorIndex: number; config: TextPluginConfig }
  >
  RenderComponent?: React.ComponentType<
    MarkRendererProps & { colorIndex: number; config: TextPluginConfig }
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
    .reduce(
      (changedEditor: Editor | CoreEditor, mark) => editor.removeMark(mark),
      editor
    )
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

const Color = styled.span<{ config: TextPluginConfig; colorIndex: number }>(
  ({ config, colorIndex }) => {
    const { theme } = config
    const colors = theme.plugins.colors.colors
    return {
      color: colors[colorIndex % colors.length]
    }
  }
)

class DefaultEditorComponent extends React.Component<
  MarkEditorProps & { config: TextPluginConfig; colorIndex: number }
> {
  public render() {
    const { config, attributes, children, colorIndex } = this.props
    return (
      <Color config={config} colorIndex={colorIndex} {...attributes}>
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
      const config = pluginClosure.current
        ? pluginClosure.current.config
        : undefined
      const { mark } = props
      if (!config) return null
      if (mark.object === 'mark' && mark.type === colorMark) {
        const colorIndex = mark.data.get('colorIndex')
        return (
          <EditorComponent config={config} colorIndex={colorIndex} {...props} />
        )
      }
      return next()
    }
  }
}
