import {
  HoveringOverlay,
  InlineCheckbox,
  styled,
  Overlay,
  faQuestionCircle,
  Icon
} from '@edtr-io/editor-ui'
import * as React from 'react'
//@ts-ignore
import MathQuill from 'react-mathquill'
import { Block, Inline } from 'slate'

import { NodeEditorProps } from '../..'
import { Dropdown, Option } from '../../toolbar/dropdown'
import { Math } from './math.component'
import { katexBlockNode, katexInlineNode } from './index'
import { isList, orderedListNode, unorderedListNode } from '../list'
import { OverlayContext } from '@edtr-io/core'
import { Button } from '../../toolbar/button'

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
  NodeEditorProps & { name: string }
> = props => {
  const { attributes, node, editor, readOnly, name } = props

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
  const overlayContext = React.useContext(OverlayContext)

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
      <>
        <Overlay>
          Schnellstartanleitung:
          <br />
          {"Schreibe Brüche mit '/'"}
          <br />
          {"Gib Potenzen ein mit Pfeil-Hoch oder '^'"}
          <br />
          {"Kleingestellt mit Pfeil runter oder '_'"}
          <br />
          {
            "Mathematische Symbole können mit '\\<NAME>' eingefügt werden, wobei <NAME> dem LaTeX-Befehl entspricht"
          }
          <br />
          {"Eingabe von Wurzeln über die Eingabe '\\sqrt' bzw '\\nthroot'"}
        </Overlay>
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
                supSubsRequireOperand: true,
                autoCommands: 'pi alpha beta gamma delta',
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
                  },
                  deleteOutOf: (dir: number) => {
                    if (dir == -1) {
                      editor.delete().focus()
                    }
                  },
                  upOutOf: (mathfield: MathQuill) => {
                    mathfield.typedText('^')
                  },
                  downOutOf: (mathfield: MathQuill) => {
                    mathfield.typedText('_')
                  }
                }
              }}
              ref={mathQuillRef}
              mathquillDidMount={(mathquill: {
                latex: () => string
                focus: () => void
              }) => {
                if (mathquill) {
                  if (mathquill.latex() == '' && formula != '') {
                    // Error occured
                    alert('Error while parsing LaTeX.')
                    setUseVisual(false)
                  }
                  setTimeout(() => {
                    editor.blur()
                    setTimeout(() => {
                      mathquill.focus()
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
            <Dropdown
              name={name}
              value={useVisual ? 'visual' : 'latex'}
              onChange={e => {
                setUseVisual(e.target.value == 'visual')
              }}
            >
              <Option active={useVisual} value="visual" name={name}>
                visual
              </Option>
              <Option active={!useVisual} value="latex" name={name}>
                latex
              </Option>
            </Dropdown>
            {!isList(orderedListNode)(editor) &&
            !isList(unorderedListNode)(editor) ? (
              <InlineCheckbox
                label="Inline"
                checked={inline}
                onChange={checked => {
                  const newData = { formula: formulaState, inline: checked }

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
            ) : null}
            <Button
              name={name}
              onClick={() => {
                overlayContext.show()
              }}
            >
              <Icon icon={faQuestionCircle} />
            </Button>
          </HoveringOverlay>
        </Wrapper>
      </>
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
