import { isHotkey } from 'is-hotkey'
import * as React from 'react'
import { Editor } from 'slate-react'

import { MarkEditorProps, MarkRendererProps, TextPlugin } from '..'
import { trimSelection, getActiveMarks } from '../helpers'
import { strongMark, emphasizeMark } from '../model'

export interface RichTextPluginOptions {
  EditorComponent?: React.ComponentType<MarkEditorProps>
  RenderComponent?: React.ComponentType<MarkRendererProps>
}

export const isStrong = (editor: Editor) => {
  return getActiveMarks(editor).some((mark) =>
    mark ? mark.type === strongMark : false
  )
}

export const isEmphasized = (editor: Editor) => {
  return getActiveMarks(editor).some((mark) =>
    mark ? mark.type === emphasizeMark : false
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

class DefaultEditorComponent extends React.Component<MarkEditorProps> {
  public render() {
    const { attributes, mark, children } = this.props

    switch (mark.type) {
      case strongMark:
        return <strong {...attributes}>{children}</strong>
      case emphasizeMark:
        return <em {...attributes}>{children}</em>
      default:
        return null
    }
  }
}

export const createRichTextPlugin = ({
  EditorComponent = DefaultEditorComponent,
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
      }

      return next()
    },

    renderMark(props, _editor, next) {
      const { mark } = props

      if (
        mark.object === 'mark' &&
        [strongMark, emphasizeMark].includes(mark.type)
      ) {
        return <EditorComponent {...props} />
      }

      return next()
    },
  }
}
