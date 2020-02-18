import { PreferenceContext, setDefaultPreference } from '@edtr-io/core/beta'
import { EditorTextarea } from '@edtr-io/editor-ui'
import { faQuestionCircle, Icon, styled } from '@edtr-io/ui'
import { canUseDOM } from 'exenv'
import * as React from 'react'
import Modal from 'react-modal'

import { NodeEditorProps, TextPluginConfig } from '../..'
import { isTouchDevice } from '../../controls'
import {
  katexBlockNode,
  katexInlineNode,
  orderedListNode,
  unorderedListNode
} from '../../model'
import { Button } from '../../toolbar/button'
import { Dropdown, Option } from '../../toolbar/dropdown'
import { HoveringOverlay } from '../hovering-overlay'
import { InlineCheckbox } from '../inline-checkbox'
import { isList } from '../list'
import { Math } from './math-component'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MathQuill: React.ComponentType<any> = canUseDOM
  ? require('react-mathquill').EditableMathField
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
          marginTop: '0.9em',
          marginBottom: '0.9em'
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

function isAndroid() {
  return isTouchDevice() && navigator && /(android)/i.test(navigator.userAgent)
}

const preferenceKey = 'katex:usevisualmath'

setDefaultPreference(preferenceKey, true)

export const DefaultEditorComponent: React.FunctionComponent<NodeEditorProps & {
  config: TextPluginConfig
}> = props => {
  const [helpOpen, setHelpOpen] = React.useState(false)
  const { attributes, editor, readOnly, node } = props

  const { data, key: nodeKey, type: nodeType } = node
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

  const setFormula = React.useCallback(
    (value: string) => {
      editor.setNodeByKey(nodeKey, {
        type: nodeType,
        data: {
          formula: value,
          inline: inline
        }
      })
    },
    [editor, nodeKey, nodeType, inline]
  )

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={helpOpen}
        onRequestClose={() => {
          setHelpOpen(false)
        }}
        style={{
          overlay: {
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          },
          content: {
            borderRadius: 0,
            backgroundColor: '#ffffff',
            width: '90%',
            maxWidth: '600px',
            inset: 'auto',
            margin: '0 auto'
          }
        }}
      >
        {props.config.i18n.math.helpText(KeySpan)}
      </Modal>
      {renderChildren()}
    </>
  )

  function renderChildren() {
    if (props.isSelected && editor.value.selection.isCollapsed && !readOnly) {
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
          {useVisualMath ? (
            <>
              <EditorWrapper
                {...attributes}
                onClick={e => {
                  e.stopPropagation()
                }}
                inline={inline}
              >
                <MathQuill
                  latex={formula}
                  onChange={(e: MathField) => {
                    setFormula(e.latex())
                  }}
                  config={mathquillConfig}
                  ref={mathQuillRef}
                  mathquillDidMount={checkLatexError}
                />
              </EditorWrapper>
            </>
          ) : (
            <Math
              formula={formula}
              inline={inline}
              innerRef={(
                ref: HTMLInputElement | HTMLTextAreaElement | null
              ) => {
                if (ref) {
                  latexInputRef.current = ref
                  ref.focus()
                }
              }}
            />
          )}
          {helpOpen ? null : (
            <HoveringOverlay
              position="above"
              anchor={useVisualMath ? wrappedMathquillRef : latexInputRef}
              allowSelectionOverflow
            >
              <div
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <Dropdown
                  config={props.config}
                  value={useVisualMath ? 'visual' : 'latex'}
                  onChange={e => {
                    if (hasError) setError(false)
                    preferences.setKey(
                      preferenceKey,
                      e.target.value == 'visual'
                    )
                  }}
                >
                  <Option
                    config={props.config}
                    active={useVisualMath}
                    value={props.config.i18n.math.editors.visual}
                  >
                    visual
                  </Option>
                  <Option
                    config={props.config}
                    active={!useVisualMath}
                    value={props.config.i18n.math.editors.latex}
                  >
                    latex
                  </Option>
                </Dropdown>
                {!isList(orderedListNode)(editor.controller) &&
                !isList(unorderedListNode)(editor.controller) ? (
                  <InlineCheckbox
                    label={props.config.i18n.math.displayBlockLabel}
                    checked={!inline}
                    onChange={handleInlineToggle}
                  />
                ) : null}
                {useVisualMath && (
                  <Button
                    config={props.config}
                    onMouseDown={() => {
                      setHelpOpen(true)
                    }}
                  >
                    <Icon icon={faQuestionCircle} />
                  </Button>
                )}

                {hasError && (
                  <>
                    {
                      props.config.i18n.math.editors
                        .noVisualEditorAvailableMessage
                    }
                    &nbsp;&nbsp;
                  </>
                )}
                <br></br>
                {!useVisualMath && (
                  <MathEditorTextArea
                    defaultValue={formula}
                    onChange={setFormula}
                  />
                )}
              </div>
            </HoveringOverlay>
          )}
        </>
      )
    } else {
      return (
        <span {...attributes}>
          {formula ? (
            <Math formula={formula} inline={inline} />
          ) : (
            <span style={{ backgroundColor: 'lightgrey' }}>
              {props.config.i18n.math.placeholder}
            </span>
          )}
        </span>
      )
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
    const newData = { formula, inline: !checked }

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
const mathEditorTextAreaStyles = {
  color: 'black',
  margin: 2,
  width: '80vw',
  maxWidth: 600
}

interface MathEditorTextAreaProps {
  defaultValue: string
  onChange: (val: string) => void
}

const MathEditorTextArea = (props: MathEditorTextAreaProps) => {
  const [latex, setLatex] = React.useState(props.defaultValue)
  const { onChange } = props
  const parentOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      setLatex(val)
      onChange(val)
    },
    [onChange]
  )

  // focus textarea when latex is empty
  const textareaRef = React.createRef<HTMLTextAreaElement>()
  React.useEffect(() => {
    const val = textareaRef.current
    if (val && !latex) {
      // timeout is needed because hovering overlay is positioned only after render of this
      setTimeout(() => {
        val.focus()
      })
    }
    // componentDidMount behaviour
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <EditorTextarea
      style={mathEditorTextAreaStyles}
      onChange={parentOnChange}
      value={latex}
      inputRef={textareaRef}
    />
  )
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
