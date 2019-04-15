import {
  NodeRendererProps,
  NodeEditorProps,
  TextPlugin,
  NodeControlsProps
} from '../..'
import { debounce } from 'lodash'
import * as React from 'react'
import { Block, Editor, Inline, BlockJSON, InlineJSON } from 'slate'

import { Math } from './math.component'
import { OverlayContext } from '@edtr-io/core'
import {
  Button,
  Checkbox,
  InlineSettings,
  Overlay,
  Textarea
} from '@edtr-io/ui'

export const katexBlockNode = '@splish-me/katex-block'
export const katexInlineNode = '@splish-me/katex-inline'

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
  return editor.insertInline({
    type: katexInlineNode,
    data: {
      formula: '',
      inline: true
    }
  })
}

export interface KatexPluginOptions {
  EditorComponent?: React.ComponentType<NodeEditorProps>
  RenderComponent?: React.ComponentType<NodeRendererProps>
  ControlsComponent?: React.ComponentType<NodeControlsProps>
}

const DefaultEditorComponent: React.FunctionComponent<
  NodeEditorProps
> = props => {
  const { attributes, node } = props

  const { data } = node as Block | Inline
  const formula = data.get('formula')
  const inline = data.get('inline')

  return (
    <span {...attributes}>
      {formula ? (
        <Math formula={formula} inline={inline} />
      ) : (
        <em>f(x) = ...</em>
      )}
    </span>
  )
}

const DefaultControlsComponent: React.FunctionComponent<
  NodeControlsProps
> = props => {
  const overlayContext = React.useContext(OverlayContext)
  const { editor } = props
  const node: Block | Inline =
    editor.value.blocks.find(blockIsKatex) ||
    editor.value.inlines.find(inlineIsKatex)
  const lastNode = React.useRef(node)
  const [value, setValue] = React.useState(
    node ? node.data.get('href') : undefined
  )
  const [graphicalEditor, showGraphicalEditor] = React.useState(false)
  if (!node) return <React.Fragment>{props.children}</React.Fragment>

  if (value === undefined || lastNode.current.key !== node.key) {
    setValue(node.data.get('formula'))
    lastNode.current = node
  }

  function inlineIsKatex(inline: Inline | undefined) {
    return inline ? inline.type === katexInlineNode : false
  }
  function blockIsKatex(block: Block | undefined) {
    return block ? block.type === katexBlockNode : false
  }

  const handleChange = debounce((formula: string) => {
    editor.setNodeByKey(node.key, {
      type: node.type,
      data: {
        formula,
        inline: node.data.get('inline')
      }
    })
  }, 500)

  return (
    <React.Fragment>
      {props.children}
      {!props.readOnly &&
      isKatex(editor) &&
      !overlayContext.visible &&
      editor.value.selection.isCollapsed ? (
        <InlineSettings
          onEdit={overlayContext.show}
          onDelete={() => editor.delete()}
        >
          {node.data.get('formula')}
        </InlineSettings>
      ) : null}
      {!props.readOnly && isKatex(editor) ? (
        <Overlay onClose={() => editor.focus()}>
          <Textarea
            label="Formula"
            value={value}
            onChange={e => {
              const newValue = e.target.value
              setValue(newValue)
              handleChange(newValue)
            }}
            placeholder="\\frac{1}{2}"
          />
          <Button
            onClick={() => {
              showGraphicalEditor(true)
            }}
          >
            Open Guppy
          </Button>
          <Checkbox
            checked={node.data.get('inline')}
            label="Inline"
            onChange={checked => {
              const inline = checked
              const data = { formula: value, inline }

              editor.removeNodeByKey(node.key)
              if (inline) {
                editor.insertInline({
                  type: katexInlineNode,
                  data
                })
              } else {
                editor.insertBlock({
                  type: katexBlockNode,
                  data
                })
              }
            }}
          />
          <span> Preview: </span>
          <Math
            formula={node.data.get('formula')}
            inline={node.data.get('inline')}
          />
        </Overlay>
      ) : null}
      {graphicalEditor ? <div>GUPPY EDITOR</div> : null}
    </React.Fragment>
  )
}
class DefaultRendererComponent extends React.Component<NodeRendererProps> {
  public render() {
    const { node } = this.props

    const { data } = node as BlockJSON | InlineJSON

    if (!data) {
      return null
    }

    const formula = data.formula as string
    const inline = data.inline as boolean

    return <Math formula={formula} inline={inline} />
  }
}

export const createKatexPlugin = ({
  EditorComponent = DefaultEditorComponent,
  RenderComponent = DefaultRendererComponent,
  ControlsComponent = DefaultControlsComponent
}: KatexPluginOptions = {}) => (): TextPlugin => {
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

    renderNode(props, _editor, next) {
      const block = props.node as Block
      const inline = props.node as Inline

      if (
        (block.object === 'block' && block.type === katexBlockNode) ||
        (inline.object === 'inline' && inline.type === katexInlineNode)
      ) {
        return <EditorComponent {...props} />
      }

      return next()
    },

    renderEditor(props, editor, next) {
      const children = next()
      return (
        <ControlsComponent {...props} editor={editor}>
          {children}
        </ControlsComponent>
      )
    }
  }
}
