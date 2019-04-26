import {
  NodeRendererProps,
  NodeEditorProps,
  TextPlugin,
  NodeControlsProps
} from '../..'
import * as React from 'react'
import { Block, Editor, Inline, BlockJSON, InlineJSON } from 'slate'
import { isHotkey } from 'is-hotkey'

import { Math } from './math.component'
import { OverlayContext } from '@edtr-io/core'
import { Checkbox, Overlay, Textarea, InlineSettings } from '@edtr-io/ui'

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
  const { attributes, node, editor, readOnly } = props

  const overlayContext = React.useContext(OverlayContext)

  const { data } = node as Block | Inline
  const inline = data.get('inline')
  const formula = data.get('formula')

  function setFormula(value: string) {
    editor.setNodeByKey(node.key, {
      type: node.type,
      data: {
        formula: value,
        inline: node.data.get('inline')
      }
    })
  }

  const [useVisual, setUseVisual] = React.useState(true)

  const mathQuillRef = React.createRef<{ element: HTMLElement }>()
  const latexInputRef = React.createRef<HTMLInputElement>()

  const wrappedMathquillRef = Object.defineProperty({}, 'current', {
    // wrapper around Mathquill component
    get: () => {
      return mathQuillRef.current ? mathQuillRef.current.element : null
    }
  })

  if (props.isSelected && editor.value.selection.isCollapsed && !readOnly) {
    return (
      <div
        {...attributes}
        onClick={e => {
          e.stopPropagation()
        }}
        style={{
          whiteSpace: undefined,
          overflowWrap: undefined,
          display: 'inline-block'
        }}
      >
        {useVisual ? (
          <MathQuill
            latex={formula} // Initial latex value for the input field
            onChange={(latex: string) => {
              // Called everytime the input changes
              setFormula(latex)
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
            ref={mathQuillRef}
            // @ts-ignore
            mathquillDidMount={x => {
              if (x.latex() == '' && formula != '') {
                // Error occured
                alert('Error while parsing LaTeX.')
                setUseVisual(false)
              }
              if (x) {
                setTimeout(() => {
                  editor.blur()
                  setTimeout(() => {
                    x.focus()
                  })
                })
              }
            }}
          />
        ) : (
          <input
            ref={latexInputRef}
            type="text"
            value={formula}
            onChange={e => {
              // Called everytime the input changes
              setFormula(e.target.value)
            }}
          />
        )}
        <InlineSettings
          onEdit={() => {
            overlayContext.show()
          }}
          onDelete={() => {
            editor.delete()
          }}
          position={'below'}
          anchor={useVisual ? wrappedMathquillRef : latexInputRef}
        >
          <select
            value={useVisual ? 'visual' : 'latex'}
            style={{ color: 'black' }}
            onChange={e => {
              setUseVisual(e.target.value == 'visual')
            }}
          >
            <option value="visual">visual</option>
            <option value="latex">latex</option>
          </select>
        </InlineSettings>
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
  const { editor } = props
  const node: Block | Inline =
    editor.value.blocks.find(blockIsKatex) ||
    editor.value.inlines.find(inlineIsKatex)
  //const lastNode = React.useRef(node)

  if (!node) return <React.Fragment>{props.children}</React.Fragment>

  // What is this for?
  /*if (lastNode.current.key !== node.key) {
    lastNode.current = node
  }*/

  function inlineIsKatex(inline: Inline | undefined) {
    return inline ? inline.type === katexInlineNode : false
  }
  function blockIsKatex(block: Block | undefined) {
    return block ? block.type === katexBlockNode : false
  }

  return (
    <React.Fragment>
      {props.children}
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
            value={node.data.get('formula')}
            onChange={e => {
              const newValue = e.target.value
              editor.setNodeByKey(node.key, {
                type: node.type,
                data: {
                  formula: newValue,
                  inline: node.data.get('inline')
                }
              })
            }}
            placeholder="Gib hier LaTeX ein, wie z.B. \frac{1}{2}"
          />
          <Checkbox
            checked={node.data.get('inline')}
            label="Inline"
            onChange={checked => {
              const inline = checked
              const data = { formula: node.data.get('formula'), inline }

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
      const e = event as KeyboardEvent
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
