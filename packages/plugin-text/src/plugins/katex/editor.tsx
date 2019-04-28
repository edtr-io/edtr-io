import { HoveringOverlay, InlineCheckbox, styled } from '@edtr-io/editor-ui'
import * as React from 'react'
import { NodeEditorProps } from '@edtr-io/plugin-text'
import { Block, Inline } from 'slate'
import { Math } from './math.component'
import { katexBlockNode, katexInlineNode } from './index'
//@ts-ignore
import MathQuill from 'react-mathquill'

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

export const DefaultEditorComponent: React.FunctionComponent<
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

  //Refs for positioning of hovering menu
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

  // state for math formula, because focus jumps to end of input field if updated directly
  const [formulaState, setFormulaState] = React.useState(formula)

  // if math formula gets selected or leaves edit, update formula from state
  const edit =
    props.isSelected && editor.value.selection.isCollapsed && !readOnly

  const lastEdit = React.useRef(edit)
  if (lastEdit.current !== edit) {
    if (formula !== formulaState) {
      setFormula(formulaState)
    }
    lastEdit.current = edit
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

  if (edit) {
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
            latex={formulaState}
            onChange={setFormulaState}
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
