import {
  HoveringOverlay,
  InlineCheckbox,
  styled,
  Overlay,
  faQuestionCircle,
  Icon
} from '@edtr-io/editor-ui'
import * as React from 'react'
// @ts-ignore
import MathQuill from 'react-mathquill'
import { Block, Inline } from 'slate'

import { NodeEditorProps } from '../..'
import { Dropdown, Option } from '../../toolbar/dropdown'
import { Math } from './math.component'
import { katexBlockNode, katexInlineNode } from './index'
import { isList, orderedListNode, unorderedListNode } from '../list'
import { OverlayContext } from '@edtr-io/core'
import { Button } from '../../toolbar/button'
import { isTouchDevice } from './plugin-text/src/controls'

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

/*
.c-keyboard_key {
  background: #ddd;
  padding: 2px 8px;
  font-size: 13px;
  font-weight: 400;
  min-width: 24px;
  height: 27px;
  margin: 0 2px;
  border-radius: 5px;
  color: #1d1c1d;
  border: 1px solid #868686;
  box-shadow: 0 1px 0 #868686;
  text-shadow: none;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  line-height: 21px;
}*/

const KeyboardKey = styled.span({
  background: '#ddd',
  padding: '2px 4px',
  borderRadius: 5,
  color: '#1d1c1d',
  textAlign: 'center',
  minWidth: 20
})

function isAndroid() {
  return isTouchDevice() && navigator && /(android)/i.test(navigator.userAgent)
}

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
    let mathquillConfig = {
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
    }
    if (isAndroid()) {
      // @ts-ignore
      mathquillConfig.substituteTextarea = alternativeTextArea
      // @ts-ignore
      mathquillConfig.substituteKeyboardEvents = alternativeSaneKeyboard
    }
    return (
      <>
        <Overlay>
          Tastenkürzel:
          <br />
          <br />
          <p>
            Bruch: <KeyboardKey>/</KeyboardKey>
          </p>
          <p>
            Hochgestellt: <KeyboardKey>↑</KeyboardKey> oder{' '}
            <KeyboardKey>^</KeyboardKey>
          </p>
          <p>
            Tiefgestellt: <KeyboardKey>↓</KeyboardKey> oder{' '}
            <KeyboardKey>_</KeyboardKey>
          </p>
          <p>
            π, α, β, γ: <KeyboardKey>pi</KeyboardKey>,{' '}
            <KeyboardKey>alpha</KeyboardKey>, <KeyboardKey>beta</KeyboardKey>,
            <KeyboardKey>gamma</KeyboardKey>
          </p>
          <p>
            ≤, ≥: <KeyboardKey>{'<='}</KeyboardKey>,{' '}
            <KeyboardKey>{'>='}</KeyboardKey>
          </p>
          <p>
            Wurzeln: <KeyboardKey>\sqrt</KeyboardKey>,{' '}
            <KeyboardKey>\nthroot</KeyboardKey>
          </p>
          <p>
            Mathematische Symbole: <KeyboardKey>{'\\<NAME>'}</KeyboardKey>, z.B.{' '}
            <KeyboardKey>\neq</KeyboardKey> (≠), <KeyboardKey>\pm</KeyboardKey>{' '}
            (±), ...
          </p>
          <p>
            Funktionen: <KeyboardKey>sin</KeyboardKey>,{' '}
            <KeyboardKey>cos</KeyboardKey>, <KeyboardKey>ln</KeyboardKey>, ...
          </p>
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
              latex={formulaState.replace('\\mathbb{N}', '\\N')}
              onChange={(e: MathQuill) => {
                setFormulaState(e.latex())
              }}
              config={mathquillConfig}
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

function alternativeTextArea() {
  let x = document.createElement('input')
  x.setAttribute('type', 'password')
  return x
}

interface SaneKeyboardHandler {
  typedText: (text: string) => void
  keystroke: (key: string, event: object) => void
}

function alternativeSaneKeyboard(
  el_: [HTMLInputElement],
  handler: SaneKeyboardHandler
) {
  let el = el_[0]
  el.value = ' '
  el.addEventListener('input', () => {
    let value: string = el.value
    if (value.length == 2) {
      handler.typedText(value.charAt(1))
    } else if (value.length == 0) {
      handler.keystroke('Backspace', { preventDefault: () => null })
    }
    el.value = ' '
  })
}
