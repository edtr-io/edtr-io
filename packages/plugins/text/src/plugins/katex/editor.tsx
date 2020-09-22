import { PreferenceContext, setDefaultPreference } from '@edtr-io/core/beta'
import { MathEditor } from '@edtr-io/math'
import type { Record } from 'immutable'
import * as React from 'react'

import { NodeEditorProps, TextPluginConfig } from '../..'
import {
  katexBlockNode,
  katexInlineNode,
  orderedListNode,
  unorderedListNode,
} from '../../model'
import { isList } from '../list'

const preferenceKey = 'katex:usevisualmath'

setDefaultPreference(preferenceKey, true)

export const DefaultEditorComponent: React.FunctionComponent<
  NodeEditorProps & {
    config: TextPluginConfig
  }
> = (props) => {
  const { attributes, editor, readOnly, node } = props
  const { key: nodeKey, type: nodeType } = node
  const data = (node.data as unknown) as KatexData
  const formula = data.get('formula')
  const inline = data.get('inline')
  const preferences = React.useContext(PreferenceContext)

  return (
    <MathEditor
      state={formula}
      inline={data.get('inline')}
      readOnly={
        !props.isSelected || !editor.value.selection.isCollapsed || readOnly
      }
      visual={preferences.getKey(preferenceKey) === true}
      disableBlock={
        isList(orderedListNode)(editor.controller) ||
        isList(unorderedListNode)(editor.controller)
      }
      config={{
        i18n: props.config.i18n.math,
        theme: props.config.theme,
      }}
      onBlur={() => {
        editor.blur()
      }}
      onEditorChange={(visual) => {
        preferences.setKey(preferenceKey, visual)
      }}
      onInlineChange={(inline) => {
        const newData = { formula, inline }

        // remove old node, merge blocks if necessary
        if (node.isLeafBlock()) {
          const n = editor.value.document.getNextBlock(node.key)
          editor.removeNodeByKey(node.key)
          if (n) {
            editor.mergeNodeByKey(n.key)
          }
        } else {
          editor.removeNodeByKey(node.key)
        }

        if (inline) {
          editor.insertInline({
            type: katexInlineNode,
            data: newData,
          })
        } else {
          editor.insertBlock({
            type: katexBlockNode,
            data: newData,
          })
        }
      }}
      onChange={(formula) => {
        editor.setNodeByKey(nodeKey, {
          type: nodeType,
          data: {
            formula,
            inline,
          },
        })
      }}
      onMoveOutLeft={() => {
        editor.moveToStart().moveBackward(1).focus()
      }}
      onMoveOutRight={() => {
        editor.moveToEnd().moveForward(1).focus()
      }}
      onDeleteOutLeft={() => {
        editor.delete().focus()
      }}
      additionalContainerProps={attributes}
    />
  )
}

type KatexData = Record<{ inline: boolean; formula: string }>
