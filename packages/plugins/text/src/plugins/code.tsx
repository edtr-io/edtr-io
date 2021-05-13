import { isHotkey } from 'is-hotkey'
import * as React from 'react'
import { Editor } from 'slate-react'

import { MarkEditorProps, TextPlugin } from '..'
import { getActiveMarks, trimSelection } from '../helpers'
import { codeMark } from '../model'

export interface CodePluginOptions {
  EditorComponent?: React.ComponentType<MarkEditorProps>
}

export const isCode = (editor: Editor) => {
  return getActiveMarks(editor).some((mark) =>
    mark ? mark.type === codeMark : false
  )
}

export const toggleCode = (editor: Editor) => {
  trimSelection(editor)
  return editor.toggleMark(codeMark)
}
class DefaultEditorComponent extends React.Component<MarkEditorProps> {
  public render() {
    const { attributes, mark, children } = this.props
    if (mark.type === codeMark) {
      return <code {...attributes}>{children}</code>
    }
    return null
  }
}

export const createCodePlugin =
  ({ EditorComponent = DefaultEditorComponent }: CodePluginOptions = {}) =>
  (): TextPlugin => {
    return {
      onKeyDown(event, editor, next) {
        const e = event as unknown as KeyboardEvent

        if (isHotkey('mod+shift+´')(e) || isHotkey('mod+shift+`')(e)) {
          e.preventDefault()
          return toggleCode(editor)
        }

        return next()
      },

      renderMark(props, _editor, next) {
        const { mark } = props

        if (mark.object === 'mark' && mark.type === codeMark) {
          return <EditorComponent {...props} />
        }

        return next()
      },
    }
  }
