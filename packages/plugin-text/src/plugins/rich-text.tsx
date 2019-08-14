import { isHotkey } from 'is-hotkey'
import * as React from 'react'
import { Editor, Mark } from 'slate'

import {
  getTrimmedSelectionRange,
  MarkEditorProps,
  MarkRendererProps,
  TextPlugin,
  trimSelection
} from '..'

export const strongMark = '@splish-me/strong'
export const emphasizeMark = '@splish-me/em'
export const codeMark = 'code'

export interface RichTextPluginOptions {
  EditorComponent?: React.ComponentType<MarkEditorProps>
  RenderComponent?: React.ComponentType<MarkRendererProps>
}

const getActiveMarks = (editor: Editor) => {
  return editor.value.document.getActiveMarksAtRange(
    getTrimmedSelectionRange(editor)
  )
}
export const isStrong = (editor: Editor) => {
  return getActiveMarks(editor).some(mark =>
    mark ? mark.type === strongMark : false
  )
}

export const isEmphasized = (editor: Editor) => {
  return getActiveMarks(editor).some(mark =>
    mark ? mark.type === emphasizeMark : false
  )
}

export const isCode = (editor: Editor) => {
  return getActiveMarks(editor).some(mark =>
    mark ? mark.type === codeMark : false
  )
}

export const toggleStrong = (editor: Editor) => {
  trimSelection(editor)
  return editor.toggleMark(strongMark)
}

export const toggleEmphasize = (editor: Editor) => {
  trimSelection(editor)
  return editor.toggleMark(emphasizeMark)
}

export const toggleCode = (editor: Editor) => {
  trimSelection(editor)
  return editor.toggleMark(codeMark)
}

class DefaultEditorComponent extends React.Component<MarkEditorProps> {
  public render() {
    const { attributes, mark, children } = this.props

    switch (mark.type) {
      case strongMark:
        return <strong {...attributes}>{children}</strong>
      case emphasizeMark:
        return <em {...attributes}>{children}</em>
      case codeMark:
        return <code {...attributes}>{children}</code>
      default:
        return null
    }
  }
}

class DefaultRendererComponent extends React.Component<MarkRendererProps> {
  public render() {
    const { mark, children } = this.props

    switch (mark.type) {
      case strongMark:
        return <strong>{children}</strong>
      case emphasizeMark:
        return <em>{children}</em>
      case codeMark:
        return <code>{children}</code>
      default:
        return null
    }
  }
}

export const createRichTextPlugin = ({
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRendererComponent
}: RichTextPluginOptions = {}) => (): TextPlugin => {
  return {
    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'strong':
        case 'b':
          return {
            object: 'mark',
            type: strongMark,
            nodes: next(el.childNodes)
          }
        case 'em':
        case 'i':
          return {
            object: 'mark',
            type: emphasizeMark,
            nodes: next(el.childNodes)
          }

        case 'code':
        case 'q':
          return {
            object: 'mark',
            type: codeMark,
            nodes: next(el.childNodes)
          }
        default:
          return
      }
    },

    onKeyDown(event, editor, next) {
      const e = (event as unknown) as KeyboardEvent
      if (isHotkey('mod+b')(e)) {
        e.preventDefault()
        return toggleStrong(editor)
      } else if (isHotkey('mod+i')(e)) {
        e.preventDefault()
        return toggleEmphasize(editor)
      } else if (isHotkey('mod+q')(e)) {
        e.preventDefault()
        return toggleCode(editor)
      }

      return next()
    },

    serialize(obj, children) {
      const mark = obj as Mark

      if (
        mark.object === 'mark' &&
        [strongMark, emphasizeMark, codeMark].indexOf(mark.type) > -1
      ) {
        return <RenderComponent mark={mark}>{children}</RenderComponent>
      }
    },

    renderMark(props, _editor, next) {
      const { mark } = props

      if (
        mark.object === 'mark' &&
        [strongMark, emphasizeMark, codeMark].indexOf(mark.type) > -1
      ) {
        return <EditorComponent {...props} />
      }

      return next()
    }
  }
}
