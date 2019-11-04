import { canUseDOM } from 'exenv'
import { isHotkey } from 'is-hotkey'
import * as React from 'react'
import { Editor } from 'slate'

import {
  NodeRendererProps,
  NodeEditorProps,
  TextPlugin,
  NodeControlsProps,
  trimSelection
} from '../..'
import { SlatePluginClosure } from '../../factory/types'
import { katexBlockNode, katexInlineNode } from '../../model'
import { DefaultEditorComponent } from './editor'

if (canUseDOM) {
  require('react-mathquill').addStyles()
}

export const isKatex = (editor: Editor) => {
  return (
    editor.value.blocks.some(block =>
      block ? block.type === katexBlockNode : false
    ) ||
    editor.value.inlines.some(inline =>
      inline ? inline.type === katexInlineNode : false
    )
  )
}
export const insertKatex = (editor: Editor) => {
  if (editor.value.selection.isExpanded) {
    trimSelection(editor)
    const selection = document.getSelection()
    editor
      .wrapInline({
        type: katexInlineNode,
        data: {
          formula: selection ? selection.toString() : '',
          inline: true
        }
      })
      .moveToEnd()
    return editor.focus().moveBackward(1)
  }
  return editor.insertInline({
    type: katexInlineNode,
    data: {
      formula: '',
      inline: true
    }
  })
}
export const removeKatex = (editor: Editor) => {
  const node =
    editor.value.blocks
      .toArray()
      .find(block => block.type === katexBlockNode) ||
    editor.value.inlines
      .toArray()
      .find(inline => inline.type === katexInlineNode)

  if (!node) return editor
  return editor.removeNodeByKey(node.key)
}

export interface KatexPluginOptions {
  EditorComponent?: React.ComponentType<NodeEditorProps & { name: string }>
  RenderComponent?: React.ComponentType<NodeRendererProps>
  ControlsComponent?: React.ComponentType<NodeControlsProps>
}

export const createKatexPlugin = ({
  EditorComponent = DefaultEditorComponent
}: KatexPluginOptions = {}) => (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  function renderEditorComponent(props: NodeEditorProps) {
    const name = pluginClosure.current ? pluginClosure.current.name : ''
    return <EditorComponent {...props} name={name} />
  }
  return {
    onKeyDown(event, editor, next) {
      const e = event as KeyboardEvent
      if (isHotkey('mod+m')(e)) {
        e.preventDefault()
        return insertKatex(editor)
      }
      return next()
    },

    renderInline(props, editor, next) {
      const inline = props.node
      if (inline.type === katexInlineNode) {
        return renderEditorComponent(props)
      }
      return next()
    },

    renderBlock(props, editor, next) {
      const block = props.node
      if (block.type === katexBlockNode) {
        return renderEditorComponent(props)
      }
      return next()
    }
  }
}
