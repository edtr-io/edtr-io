// eslint-disable-next-line @typescript-eslint/no-explicit-any
import exenv from 'exenv'
import * as React from 'react'

import { MathEditorProps } from './editor-props'

export const MathQuill: React.ComponentType<{
  latex: string
  config: unknown
  onChange(e: MathField): void
  mathquillDidMount(e: MathField): void
}> = exenv.canUseDOM
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-mathquill').EditableMathField
  : () => null

function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function isAndroid() {
  return isTouchDevice() && navigator && /(android)/i.test(navigator.userAgent)
}

function alternativeTextArea() {
  const x = document.createElement('input')
  x.setAttribute('type', 'password')
  return x
}

interface SaneKeyboardHandler {
  typedText: (text: string) => void
  keystroke: (key: string, event: unknown) => void
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

interface MathField {
  typedText(text: string): void
  latex(): string
  focus(): void
}

interface VisualEditorProps extends MathEditorProps {
  onError(): void
}

export function VisualEditor(props: VisualEditorProps) {
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('react-mathquill').addStyles()
  }, [])
  const mathQuillConfig = {
    supSubsRequireOperand: true,
    autoCommands: 'pi alpha beta gamma delta',
    handlers: {
      moveOutOf: (dir: -1 | 1) => {
        if (dir === 1 && typeof props.onMoveOutRight === 'function') {
          props.onMoveOutRight()
        } else if (dir === -1 && typeof props.onMoveOutLeft === 'function') {
          props.onMoveOutLeft()
        }
      },
      deleteOutOf: (dir: -1 | 1) => {
        if (dir === 1 && typeof props.onDeleteOutRight === 'function') {
          props.onDeleteOutRight()
        } else if (dir === -1 && typeof props.onDeleteOutLeft === 'function') {
          props.onDeleteOutLeft()
        }
      },
      upOutOf: (mathField: MathField) => {
        mathField.typedText('^')
      },
      downOutOf: (mathField: MathField) => {
        mathField.typedText('_')
      },
    },
    ...(isAndroid()
      ? {
          substituteTextarea: alternativeTextArea,
          substituteKeyboardEvents: alternativeSaneKeyboard,
        }
      : {}),
  }

  return (
    <MathQuill
      latex={props.state}
      onChange={(ref) => {
        props.onChange(ref.latex())
      }}
      config={mathQuillConfig}
      mathquillDidMount={onMount}
    />
  )

  function onMount(ref: MathField) {
    if (ref.latex() == '' && props.state != '') {
      props.onError()
    }
    setTimeout(() => {
      if (typeof props.onBlur === 'function') {
        props.onBlur()
      }
      ref.focus()
    })
  }
}
