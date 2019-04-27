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
import { HoveringOverlay, styled, InlineCheckbox } from '@edtr-io/editor-ui'

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

const Wrapper = styled.div<{ inline: boolean }>(props => {
  return {
    whiteSpace: undefined,
    overflowWrap: undefined,
    ...(props.inline
      ? {
          display: 'inline-block'
        }
      : {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '15px'
        })
  }
})

const DefaultEditorComponent: React.FunctionComponent<
  NodeEditorProps
> = props => {
  const { attributes, node, editor, readOnly } = props

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

  const mathQuillRef = React.createRef<typeof MathQuill>()
  const latexInputRef = React.useRef<
    HTMLInputElement | HTMLTextAreaElement | null
  >()

  const wrappedMathquillRef = Object.defineProperty({}, 'current', {
    // wrapper around Mathquill component
    get: () => {
      return mathQuillRef.current ? mathQuillRef.current.element : null
    }
  })
  const [formulaState, setFormulaState] = React.useState(formula)

  // if math formula gets selected or leaves edit, update formula from state
  const edit = React.useRef(
    props.isSelected && editor.value.selection.isCollapsed && !readOnly
  )
  if (
    edit.current !==
    (props.isSelected && editor.value.selection.isCollapsed && !readOnly)
  ) {
    if (formula !== formulaState) {
      setFormula(formulaState)
    }
    edit.current =
      props.isSelected && editor.value.selection.isCollapsed && !readOnly
  }

  function checkLeaveLatexInput(e: React.KeyboardEvent) {
    if (!latexInputRef.current) return
    const { selectionEnd, value } = latexInputRef.current
    if (e.key === 'ArrowLeft' && selectionEnd === 0) {
      // leave left
      editor
        .moveToStart()
        .moveBackward(1)
        .focus()
    } else if (e.key === 'ArrowRight' && selectionEnd === value.length) {
      // leave right
      editor
        .moveToEnd()
        .moveForward(1)
        .focus()
    }
  }

  if (edit.current) {
    return (
      <Wrapper
        {...attributes}
        onClick={e => {
          e.stopPropagation()
        }}
        inline={inline}
      >
        {useVisual ? (
          <MathQuill
            latex={formulaState} // Initial latex value for the input field
            onChange={(latex: string) => {
              // Called everytime the input changes
              setFormulaState(latex)
            }}
            config={{
              handlers: {
                moveOutOf: (dir: number) => {
                  if (dir == 1) {
                    // leave right
                    editor
                      .moveToEnd()
                      .moveForward(1)
                      .focus()
                  } else if (dir == -1) {
                    // leave left
                    editor
                      .moveToStart()
                      .moveBackward(1)
                      .focus()
                  }
                }
              }
            }}
            ref={mathQuillRef}
            mathquillDidMount={(x: {
              latex: () => string
              focus: () => void
            }) => {
              if (x) {
                if (x.latex() == '' && formula != '') {
                  // Error occured
                  alert('Error while parsing LaTeX.')
                  setUseVisual(false)
                }
                setTimeout(() => {
                  editor.blur()
                  setTimeout(() => {
                    x.focus()
                  })
                })
              }
            }}
          />
        ) : inline ? (
          <input
            ref={ref => (latexInputRef.current = ref)}
            type="text"
            value={formulaState}
            onChange={e => {
              //cant set formula directly, because otherwise focus jumps to end of input field
              setFormulaState(e.target.value)
            }}
            onKeyDown={checkLeaveLatexInput}
            autoFocus
          />
        ) : (
          <textarea
            style={{ width: '100%' }}
            ref={ref => (latexInputRef.current = ref)}
            value={formulaState}
            onChange={e => setFormulaState(e.target.value)}
            onKeyDown={checkLeaveLatexInput}
            autoFocus
          />
        )}
        <HoveringOverlay
          position={'above'}
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
          <InlineCheckbox
            label="Inline"
            checked={inline}
            onChange={checked => {
              const newData = { formula, inline: checked }

              editor.removeNodeByKey(node.key)
              if (checked) {
                editor.insertInline({
                  type: katexInlineNode,
                  data: newData
                })
              } else {
                editor.insertBlock({
                  type: katexBlockNode,
                  data: newData
                })
              }
            }}
          />
        </HoveringOverlay>
      </Wrapper>
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
  RenderComponent = DefaultRendererComponent
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
    }
  }
}
