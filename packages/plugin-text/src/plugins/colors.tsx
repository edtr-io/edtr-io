import * as React from 'react'
import { Editor, Mark } from 'slate'
import {
  createTextPluginTheme,
  getTrimmedSelectionRange,
  MarkEditorProps,
  MarkRendererProps,
  TextPlugin
} from '..'
import { ThemeProps, styled } from '@edtr-io/ui'

export const colorMark = '@splish-me/color'

export interface ColorPluginOptions {
  EditorComponent?: React.ComponentType<
    MarkEditorProps & { colorIndex: number }
  >
  RenderComponent?: React.ComponentType<
    MarkRendererProps & { colorIndex: number }
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

const Color = styled.span((props: ThemeProps & { colorIndex: number }) => {
  const theme = createTextPluginTheme(name, props.theme)
  const colors = theme.plugins.colors.colors
  return {
    color: colors[props.colorIndex % colors.length]
  }
})

class DefaultEditorComponent extends React.Component<
  MarkEditorProps & { colorIndex: number }
> {
  public render() {
    const { attributes, children, colorIndex } = this.props
    return (
      <Color colorIndex={colorIndex} {...attributes}>
        {children}
      </Color>
    )
  }
}

class DefaultRendererComponent extends React.Component<
  MarkRendererProps & { colorIndex: number }
> {
  public render() {
    const { children, colorIndex } = this.props
    return <Color colorIndex={colorIndex}>{children}</Color>
  }
}

export const createColorPlugin = ({
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRendererComponent
}: ColorPluginOptions = {}) => (): TextPlugin => {
  // TODO: deserialize
  return {
    serialize(obj, children) {
      const mark = obj as Mark
      if (mark.object === 'mark') {
        const colorIndex = mark.data.get('colorIndex')
        return (
          <RenderComponent mark={mark} colorIndex={colorIndex}>
            {children}
          </RenderComponent>
        )
      }
    },

    renderMark(props, _editor, next) {
      const { mark } = props
      if (mark.object === 'mark' && mark.type === colorMark) {
        const colorIndex = mark.data.get('colorIndex')
        return <EditorComponent colorIndex={colorIndex} {...props} />
      }
      return next()
    }
  }
}
