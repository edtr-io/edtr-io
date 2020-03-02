import { isHotkey } from 'is-hotkey'
import * as React from 'react'
import { Editor } from 'slate-react'

import { MarkEditorProps, MarkRendererProps, TextPlugin } from '..'
import { getTrimmedSelectionRange, trimSelection } from '../helpers'
import { strongMark, emphasizeMark } from '../model'

// in use?
const codeMark = 'code'

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

export const createRichTextPlugin = ({
  EditorComponent = DefaultEditorComponent
}: RichTextPluginOptions = {}) => (): TextPlugin => {
  return {
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

    renderMark(props, _editor, next) {
      const { mark } = props

      if (
        mark.object === 'mark' &&
        [strongMark, emphasizeMark, codeMark].includes(mark.type)
      ) {
        return <EditorComponent {...props} />
      }

      return next()
    }
  }
}
