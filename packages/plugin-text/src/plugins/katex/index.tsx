import {
  NodeRendererProps,
  NodeEditorProps,
  TextPlugin,
  NodeControlsProps
} from '../..'
import { debounce } from 'lodash'
import * as React from 'react'
import { Block, Editor, Inline, BlockJSON, InlineJSON } from 'slate'
import { isHotkey } from 'is-hotkey'

import { Math } from './math.component'
import { OverlayContext } from '@edtr-io/core'
import { Button, Checkbox, Overlay, Textarea } from '@edtr-io/ui'

// @ts-ignore
import MathQuill, { addStyles as addMathquillStyles } from 'react-mathquill'

addMathquillStyles()

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
  const { attributes, node, editor } = props

  const { data } = node as Block | Inline
  const inline = data.get('inline')
  const formula = data.get('formula')
  const setFormula = React.useState(
    node ? node.data.get('formula') : undefined
  )[1]

  const handleChange = debounce((formula: string) => {
    editor.setNodeByKey(node.key, {
      type: node.type,
      data: {
        formula,
        inline: node.data.get('inline')
      }
    })
  }, 50)

  if (props.isSelected && editor.value.selection.isCollapsed) {
    return (
      <div
        onClick={e => {
          e.stopPropagation()
        }}
        style={{
          whiteSpace: undefined,
          overflowWrap: undefined,
          display: 'inline'
        }}
      >
        <MathQuill
          latex={formula} // Initial latex value for the input field
          onChange={(latex: string) => {
            // Called everytime the input changes
            setFormula(latex)
            handleChange(latex)
          }}
          config={{
            handlers: {
              moveOutOf: (dir: number) => {
                if (dir == 1) {
                  // leave right
                  editor.moveToEnd()
                  editor.moveForward(1)
                  editor.focus()
                } else if (dir == -1) {
                  // leave left
                  editor.moveToStart()
                  editor.moveBackward(1)
                  editor.focus()
                }
              }
            }
          }}
          // @ts-ignore
          ref={(x: unknown) => {
            if (x) {
              setTimeout(() => {
                editor.blur()
                setTimeout(() => {
                  // @ts-ignore
                  x.mathField.focus()
                })
              }, 0)
            }
          }}
        />
      </div>
    )
  }

  return (
    <span {...attributes}>
      {formula ? (
        <Math formula={formula} inline={inline} />
      ) : (
        <span style={{ backgroundColor: 'lightgrey' }}>[neue Formel]</span>
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
    node ? node.data.get('formula') : undefined
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
      {/*<InlineSettings
          onEdit={() => {
            setValue(node.data.get('formula'))
            overlayContext.show()
          }}
          onDelete={() => editor.delete()}
        />*/}
      {props.children}
      {!props.readOnly &&
      isKatex(editor) &&
      !overlayContext.visible &&
      editor.value.selection.isCollapsed ? (
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 0,
            backgroundColor: 'yellow'
          }}
        >
          <a
            href="#"
            onClick={() => {
              setValue(node.data.get('formula'))
              overlayContext.show()
            }}
          >
            LaTeX
          </a>{' '}
          &nbsp; &nbsp;
          <a href="#" onClick={() => editor.delete()}>
            X
          </a>
        </div>
      ) : null}
      {!props.readOnly && isKatex(editor) ? (
        <Overlay
          onClose={() => {
            editor.focus()
            editor.moveToEnd()
            editor.moveForward(1)
          }}
        >
          <Textarea
            label="Formula"
            value={value}
            onChange={e => {
              const newValue = e.target.value
              setValue(newValue)
              handleChange(newValue)
            }}
            placeholder="Gib hier LaTeX ein, wie z.B. \frac{1}{2}"
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

    onKeyDown(event, editor, next) {
      const e = (event as unknown) as KeyboardEvent
      if (isHotkey('mod+m')(e)) {
        insertKatex(editor)
        e.preventDefault()
      }
      next()
    },

    renderNode(props, _editor, next) {
      const block = props.node as Block
      const inline = props.node as Inline

      if (
        (block.object === 'block' && block.type === katexBlockNode) ||
        (inline.object === 'inline' && inline.type === katexInlineNode)
      ) {
        return <EditorComponent {...props} editor={_editor} />
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
