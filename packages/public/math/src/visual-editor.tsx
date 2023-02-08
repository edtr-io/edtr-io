import * as React from 'react'
import * as MQ from 'react-mathquill'

import { MathEditorProps } from './editor-props'

// @ts-expect-error https://github.com/serlo/serlo-editor-issues-and-documentation/issues/68
MQ.default?.addStyles ? MQ.default.addStyles() : MQ.addStyles()

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
    <MQ.EditableMathField
      latex={props.state}
      onChange={(ref) => {
        props.onChange(ref.latex())
      }}
      // @ts-expect-error https://github.com/serlo/serlo-editor-issues-and-documentation/issues/67
      config={mathQuillConfig}
      mathquillDidMount={onMount}
    />
  )

  function onMount(ref: MathField) {
    if (ref.latex() == '' && props.state != '') {
      props.onError()
    }
    // TODO: Check if this can be removed
    setTimeout(() => {
      ref.focus()
    })
  }
}
