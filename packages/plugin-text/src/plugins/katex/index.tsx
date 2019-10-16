import { katexBlockNode, katexInlineNode } from '@edtr-io/plugin-text-state'
import { canUseDOM } from 'exenv'
import { isHotkey } from 'is-hotkey'
import * as React from 'react'
import { Block, Editor, Inline } from 'slate'

import {
  NodeRendererProps,
  NodeEditorProps,
  TextPlugin,
  NodeControlsProps,
  trimSelection
} from '../..'
import { SlatePluginClosure } from '../../factory/types'
import { DefaultEditorComponent } from './editor'
import { DefaultRendererComponent } from './renderer'

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
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRendererComponent
}: KatexPluginOptions = {}) => (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  function renderEditorComponent(props: NodeEditorProps) {
    const name = pluginClosure.current ? pluginClosure.current.name : ''
    return <EditorComponent {...props} name={name} />
  }
  return {
    deserialize(el, next) {
      switch (el.tagName.toLowerCase()) {
        case 'katexblock':
          return {
            object: 'block',
            type: katexBlockNode,
            data: {
              formula: el.childNodes[0].nodeValue,
              inline: false
            },
            nodes: next(el.childNodes)
          }
        case 'katexinline':
          return {
            object: 'inline',
            type: katexInlineNode,
            data: {
              formula: el.childNodes[0].nodeValue,
              inline: true
            },
            nodes: next(el.childNodes)
          }
        default:
          return
      }
    },

    serialize(obj, children) {
      const block = obj as Block
      const inline = obj as Inline

      if (
        (block.object === 'block' && block.type === katexBlockNode) ||
        (inline.object === 'inline' && inline.type === katexInlineNode)
      ) {
        return <RenderComponent node={obj}>{children}</RenderComponent>
      }
    },

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
