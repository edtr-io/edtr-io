import {
  faQuestionCircle,
  HoveringOverlay,
  Icon,
  InlineCheckbox,
  Overlay,
  styled
} from '@edtr-io/editor-ui'
import { canUseDOM } from 'exenv'
import * as React from 'react'
import { Block, Inline } from 'slate'
import { OverlayContext } from '@edtr-io/core'

import { NodeEditorProps } from '../..'
import { Dropdown, Option } from '../../toolbar/dropdown'
import { Math } from './math.component'
import { katexBlockNode, katexInlineNode } from './index'
import { isList, orderedListNode, unorderedListNode } from '../list'
import { Button } from '../../toolbar/button'
import { isTouchDevice } from '../../controls'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MathQuill: React.ComponentType<any> = canUseDOM
  ? require('react-mathquill').default
  : () => null

interface MathField {
  typedText(text: string): void

  latex(): string
}

const EditorWrapper = styled.div<{ inline: boolean }>(props => {
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

const KeySpan = styled.span({
  background: '#ddd',
  padding: '2px 4px',
  borderRadius: 5,
  color: '#1d1c1d',
  textAlign: 'center',
  minWidth: 20
})

const HelpText = (
  <>
    Tastenkürzel:
    <br />
    <br />
    <p>
      Bruch: <KeySpan>/</KeySpan>
    </p>
    <p>
      Hochgestellt: <KeySpan>↑</KeySpan> oder <KeySpan>^</KeySpan>
    </p>
    <p>
      Tiefgestellt: <KeySpan>↓</KeySpan> oder <KeySpan>_</KeySpan>
    </p>
    <p>
      π, α, β, γ: <KeySpan>pi</KeySpan>, <KeySpan>alpha</KeySpan>,{' '}
      <KeySpan>beta</KeySpan>,<KeySpan>gamma</KeySpan>
    </p>
    <p>
      ≤, ≥: <KeySpan>{'<='}</KeySpan>, <KeySpan>{'>='}</KeySpan>
    </p>
    <p>
      Wurzeln: <KeySpan>\sqrt</KeySpan>, <KeySpan>\nthroot</KeySpan>
    </p>
    <p>
      Mathematische Symbole: <KeySpan>{'\\<NAME>'}</KeySpan>, z.B.{' '}
      <KeySpan>\neq</KeySpan> (≠), <KeySpan>\pm</KeySpan> (±), ...
    </p>
    <p>
      Funktionen: <KeySpan>sin</KeySpan>, <KeySpan>cos</KeySpan>,{' '}
      <KeySpan>ln</KeySpan>, ...
    </p>
  </>
)

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
      return mathQuillRef.current
        ? ((mathQuillRef.current as unknown) as { element: unknown }).element
        : null
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

  function handleInlineToggle(checked: boolean) {
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
  }

  function checkLatexError(mathquill: {
    latex: () => string
    focus: () => void
  }) {
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
  }

  function updateLatex(val: string) {
    //cant set formula directly, because otherwise focus jumps to end of input field
    setFormulaState(val)
    // but android is different ...
    if (isAndroid()) {
      setFormula(val)
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
        upOutOf: (mathfield: MathField) => {
          mathfield.typedText('^')
        },
        downOutOf: (mathfield: MathField) => {
          mathfield.typedText('_')
        }
      },
      ...(isAndroid()
        ? {
            substituteTextarea: alternativeTextArea,
            substituteKeyboardEvents: alternativeSaneKeyboard
          }
        : {})
    }
    return (
      <>
        <Overlay>{HelpText}</Overlay>
        <EditorWrapper
          {...attributes}
          onClick={e => {
            e.stopPropagation()
          }}
          inline={inline}
        >
          {useVisual ? (
            <MathQuill
              latex={formulaState.replace('\\mathbb{N}', '\\N')}
              onChange={(e: MathField) => {
                updateLatex(e.latex())
              }}
              config={mathquillConfig}
              ref={mathQuillRef}
              mathquillDidMount={checkLatexError}
            />
          ) : inline ? (
            <input
              ref={ref => (latexInputRef.current = ref)}
              type="text"
              value={formulaState}
              onChange={e => {
                updateLatex(e.target.value)
              }}
              onKeyDown={checkLeaveLatexInput}
              autoFocus
            />
          ) : (
            <textarea
              style={{ width: '100%' }}
              ref={ref => (latexInputRef.current = ref)}
              value={formulaState}
              onChange={e => updateLatex(e.target.value)}
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
                onChange={handleInlineToggle}
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
        </EditorWrapper>
      </>
    )
  } else {
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
    setTimeout(() => {
      el.value = ' '
    })
  })
}
