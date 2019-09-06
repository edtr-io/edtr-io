import { OverlayContext, PreferenceContext } from '@edtr-io/core'
import {
  faQuestionCircle,
  HoveringOverlay,
  Icon,
  InlineCheckbox,
  Overlay,
  styled
} from '@edtr-io/editor-ui'
import { EditorTextarea } from '@edtr-io/renderer-ui'
import { canUseDOM } from 'exenv'
import * as React from 'react'

import { katexBlockNode, katexInlineNode, EditCommitCache } from '.'
import { NodeEditorProps } from '../..'
import { isTouchDevice } from '../../controls'
import { Button } from '../../toolbar/button'
import { Dropdown, Option } from '../../toolbar/dropdown'
import { isList, orderedListNode, unorderedListNode } from '../list'
import { Math } from './math-component'

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

const preferenceKey = 'katex:usevisualmath'

export const DefaultEditorComponent: React.FunctionComponent<
  NodeEditorProps & { name: string; cache: EditCommitCache }
> = props => {
  const { attributes, editor, readOnly, name, node, cache } = props

  const { data } = node
  const inline = data.get('inline')
  const formula = data.get('formula')

  const preferences = React.useContext(PreferenceContext)
  const [hasError, setError] = React.useState(false)
  const useVisualMath = preferences.getKey(preferenceKey) && !hasError

  //Refs for positioning of hovering menu
  const mathQuillRef = React.createRef<typeof MathQuill>()
  const latexInputRef: React.MutableRefObject<
    HTMLInputElement | HTMLTextAreaElement | null
  > = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null)
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

  const setFormula = React.useCallback(
    (value: string) => {
      editor.setNodeByKey(node.key, {
        type: node.type,
        data: {
          formula: value,
          inline: node.data.get('inline')
        }
      })
    },
    [editor, node]
  )

  React.useEffect(() => {
    if (formula !== formulaState) {
      setFormula(formulaState)
      cache.key = undefined
      cache.value = undefined
    }
  }, [edit, cache, formula, formulaState, setFormula])

  // apply uncommited changes if present
  React.useEffect(() => {
    if (cache.value && node.key == cache.key) {
      if (formula !== cache.value) {
        setFormula(cache.value)
        setFormulaState(cache.value)
        cache.key = undefined
        cache.value = undefined
      }
    }
  }, [cache, formula, formulaState, setFormula, setFormulaState, node.key])

  if (edit) {
    const mathquillConfig = {
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
          {useVisualMath ? (
            <MathQuill
              latex={formulaState}
              onChange={(e: MathField) => {
                updateLatex(e.latex())
              }}
              config={mathquillConfig}
              ref={mathQuillRef}
              mathquillDidMount={checkLatexError}
            />
          ) : inline ? (
            <Math
              formula={formulaState}
              inline
              innerRef={(ref: any) => {
                if (ref) {
                  latexInputRef.current = ref
                  ref.focus()
                }
              }}
            />
          ) : (
            <>
              <Math formula={formulaState} />
            </>
          )}
          <HoveringOverlay
            position="above"
            anchor={useVisualMath ? wrappedMathquillRef : latexInputRef}
          >
            <Dropdown
              name={name}
              value={useVisualMath ? 'visual' : 'latex'}
              onChange={e => {
                if (hasError) setError(false)
                preferences.setKey(preferenceKey, e.target.value == 'visual')
              }}
            >
              <Option active={useVisualMath} value="visual" name={name}>
                visual
              </Option>
              <Option active={!useVisualMath} value="latex" name={name}>
                latex
              </Option>
            </Dropdown>
            {!isList(orderedListNode)(editor) &&
            !isList(unorderedListNode)(editor) ? (
              <InlineCheckbox
                label="eigene Zeile"
                checked={!inline}
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
            {hasError && <>Nur LaTeX verfügbar&nbsp;&nbsp;</>}
            <br></br>
            {!useVisualMath && (
              <>
                <EditorTextarea
                  style={{
                    color: 'black',
                    margin: 2,
                    width: '80vw',
                    maxWidth: 600
                  }}
                  onChange={(e: any) => {
                    updateLatex(e.target.value)
                  }}
                  value={formulaState}
                />
                &nbsp;
              </>
            )}
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

  function updateLatex(val: string) {
    // store edits in cache
    cache.key = node.key
    cache.value = val
    //cant set formula directly, because otherwise focus jumps to end of input field
    setFormulaState(val)
    // but android is different ...
    if (isAndroid()) {
      setFormula(val)
    }
  }

  function checkLatexError(mathquill: {
    latex: () => string
    focus: () => void
  }) {
    if (mathquill) {
      if (mathquill.latex() == '' && formula != '') {
        // Error occured
        setError(true)
      }
      setTimeout(() => {
        editor.blur()
        setTimeout(() => {
          mathquill.focus()
        })
      })
    }
  }

  function handleInlineToggle(checked: boolean) {
    const newData = { formula: formulaState, inline: !checked }

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
      editor.insertBlock({
        type: katexBlockNode,
        data: newData
      })
    } else {
      editor.insertInline({
        type: katexInlineNode,
        data: newData
      })
    }
  }
}

function alternativeTextArea() {
  const x = document.createElement('input')
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
  const el = el_[0]
  el.value = ' '
  el.addEventListener('input', () => {
    const value: string = el.value
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
