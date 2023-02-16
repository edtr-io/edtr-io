import { EditorTextarea, HoverOverlay, styled } from '@edtr-io/editor-ui'
import { faQuestionCircle, Icon, merge, useEditorTheme } from '@edtr-io/ui'
import * as React from 'react'
import Modal from 'react-modal'

import { Button } from './button'
import { Dropdown, Option } from './dropdown'
import { MathEditorConfig } from './editor-config'
import { MathEditorProps } from './editor-props'
import { InlineCheckbox } from './inline-checkbox'
import { MathRenderer } from './renderer'
import { VisualEditor } from './visual-editor'

const EditorWrapper = styled.div<{ inline?: boolean }>((props) => {
  return {
    whiteSpace: undefined,
    overflowWrap: undefined,
    ...(props.inline
      ? {
          display: 'inline-block',
        }
      : {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '0.9em',
          marginBottom: '0.9em',
        }),
  }
})

interface MathEditorTextAreaProps
  extends Pick<
    MathEditorProps,
    'onChange' | 'onMoveOutLeft' | 'onMoveOutRight'
  > {
  defaultValue: string
  onChange: (value: string) => void
}

const mathEditorTextareaStyle = {
  color: 'black',
  margin: 2,
  width: '80vw',
  maxWidth: 600,
}

const MathEditorTextArea = (props: MathEditorTextAreaProps) => {
  const [latex, setLatex] = React.useState(props.defaultValue)
  const { onChange } = props
  const parentOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setLatex(value)
      onChange(value)
    },
    [onChange]
  )

  // Autofocus textarea
  const textareaRef = React.createRef<HTMLTextAreaElement>()
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea)
      // Timeout is needed because hovering overlay is positioned only after render of this
      setTimeout(() => {
        textarea.focus()
      })
    // componentDidMount behaviour
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <EditorTextarea
      style={mathEditorTextareaStyle}
      onChange={parentOnChange}
      onMoveOutRight={props.onMoveOutRight}
      onMoveOutLeft={props.onMoveOutLeft}
      value={latex}
      ref={textareaRef}
    />
  )
}

const KeySpan = styled.span({
  background: '#ddd',
  padding: '2px 4px',
  borderRadius: 5,
  color: '#1d1c1d',
  textAlign: 'center',
  minWidth: 20,
})

/**
 * @param props - The {@link @edtr-io/math#MathEditorProps | math editor props}
 * @public
 */
export function MathEditor(props: MathEditorProps) {
  const anchorRef = React.createRef<HTMLDivElement>()
  const [helpOpen, setHelpOpen] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const { visual, readOnly, state, disableBlock } = props

  const useVisualEditor = visual && !hasError

  const editorTheme = useEditorTheme()
  const config = merge<MathEditorConfig>({
    fallback: {
      i18n: {
        placeholder: '[formula]',
        displayBlockLabel: 'Display as block',
        editors: {
          visual: 'visual',
          latex: 'LaTeX',
          noVisualEditorAvailableMessage: 'Only LaTeX editor available',
        },
        helpText(KeySpan: React.ComponentType<{ children: React.ReactNode }>) {
          return (
            <>
              Shortcuts:
              <br />
              <br />
              <p>
                Fraction: <KeySpan>/</KeySpan>
              </p>
              <p>
                Superscript: <KeySpan>↑</KeySpan> or <KeySpan>^</KeySpan>
              </p>
              <p>
                Subscript: <KeySpan>↓</KeySpan> oder <KeySpan>_</KeySpan>
              </p>
              <p>
                π, α, β, γ: <KeySpan>pi</KeySpan>, <KeySpan>alpha</KeySpan>,{' '}
                <KeySpan>beta</KeySpan>,<KeySpan>gamma</KeySpan>
              </p>
              <p>
                ≤, ≥: <KeySpan>{'<='}</KeySpan>, <KeySpan>{'>='}</KeySpan>
              </p>
              <p>
                Root: <KeySpan>\sqrt</KeySpan>, <KeySpan>\nthroot</KeySpan>
              </p>
              <p>
                Math symbols: <KeySpan>{'\\<NAME>'}</KeySpan>, e.g.{' '}
                <KeySpan>\neq</KeySpan> (≠), <KeySpan>\pm</KeySpan> (±), ...
              </p>
              <p>
                Functions: <KeySpan>sin</KeySpan>, <KeySpan>cos</KeySpan>,{' '}
                <KeySpan>ln</KeySpan>, ...
              </p>
            </>
          )
        },
      },
      theme: {
        backgroundColor: 'transparent',
        color: editorTheme.editor.color,
        hoverColor: editorTheme.editor.primary.background,
        active: {
          backgroundColor: '#b6b6b6',
          color: editorTheme.editor.backgroundColor,
        },
        dropDown: {
          backgroundColor: editorTheme.editor.backgroundColor,
        },
      },
    },
    values: props.config,
  })

  return (
    <React.Fragment>
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
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
          content: {
            borderRadius: 0,
            backgroundColor: '#ffffff',
            width: '90%',
            maxWidth: '600px',
            maxHeight: 'calc(100vh - 80px)',
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            margin: '0 auto',
          },
        }}
      >
        {config.i18n.helpText(KeySpan)}
      </Modal>
      {renderChildren()}
    </React.Fragment>
  )

  function renderChildren() {
    if (readOnly) {
      return state ? (
        <MathRenderer {...props} />
      ) : (
        <span
          style={{ backgroundColor: 'lightgrey' }}
          {...props.additionalContainerProps}
        >
          {config.i18n.placeholder}
        </span>
      )
    }

    return (
      <React.Fragment>
        {useVisualEditor ? (
          <EditorWrapper
            onClick={(e) => {
              e.stopPropagation()
            }}
            inline={props.inline}
            ref={anchorRef}
            {...props.additionalContainerProps}
          >
            <VisualEditor
              {...props}
              onError={() => {
                setHasError(true)
              }}
            />
          </EditorWrapper>
        ) : (
          <MathRenderer {...props} ref={anchorRef} />
        )}
        {helpOpen ? null : (
          <HoverOverlay position="above" anchor={anchorRef}>
            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Dropdown
                config={config}
                value={useVisualEditor ? 'visual' : 'latex'}
                onChange={(e) => {
                  if (hasError) setHasError(false)
                  props.onEditorChange(e.target.value === 'visual')
                }}
              >
                <Option config={config} active={useVisualEditor} value="visual">
                  {config.i18n.editors.visual}
                </Option>
                <Option config={config} active={!useVisualEditor} value="latex">
                  {config.i18n.editors.latex}
                </Option>
              </Dropdown>
              {!disableBlock && (
                <InlineCheckbox
                  label={config.i18n.displayBlockLabel}
                  checked={!props.inline}
                  onChange={(checked) => {
                    if (typeof props.onInlineChange === 'function') {
                      props.onInlineChange(!checked)
                    }
                  }}
                />
              )}
              {useVisualEditor && (
                <Button
                  config={config}
                  onMouseDown={() => {
                    setHelpOpen(true)
                  }}
                >
                  <Icon icon={faQuestionCircle} />
                </Button>
              )}
              {hasError && (
                <React.Fragment>
                  {config.i18n.editors.noVisualEditorAvailableMessage}
                  &nbsp;&nbsp;
                </React.Fragment>
              )}
              <br />
              {!useVisualEditor && (
                <MathEditorTextArea {...props} defaultValue={state} />
              )}
            </div>
          </HoverOverlay>
        )}
      </React.Fragment>
    )
  }
}
