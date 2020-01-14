import { canUseDOM } from 'exenv'
import * as React from 'react'
import { ReactEditor } from 'slate-react'

import { useEditor } from '../../helpers'
import { MathElement } from './types'

const MathQuill: React.ComponentType<MathquillProps> = canUseDOM
  ? require('react-mathquill').default
  : () => null

export function VisualEditor({
  element,
  onChange,
  onError
}: VisualEditorProps) {
  const editor = useEditor()
  React.useEffect(() => {
    if (canUseDOM) {
      require('react-mathquill').addStyles()
    }
  }, [])

  return (
    <MathQuill
      latex={element.src}
      onChange={value => {
        onChange({
          ...element,
          src: value.latex()
        })
      }}
      mathquillDidMount={value => {
        if (value.latex() == '' && element.src !== '') {
          onError()
        }
        setTimeout(() => {
          ReactEditor.blur(editor)
          setTimeout(() => {
            value.focus()
          })
        })
      }}
      config={{
        supSubsRequireOperand: true,
        autoCommands: 'pi alpha beta gamma delta',
        handlers: {
          // moveOutOf: (dir: number) => {
          //   if (dir == 1) {
          //     // leave right
          //     editor
          //       .moveToEnd()
          //       .moveForward(1)
          //       .focus()
          //   } else if (dir == -1) {
          //     // leave left
          //     editor
          //       .moveToStart()
          //       .moveBackward(1)
          //       .focus()
          //   }
          // },
          // deleteOutOf: (dir: number) => {
          //   if (dir == -1) {
          //     editor.delete().focus()
          //   }
          // },
          // upOutOf: (mathfield: MathField) => {
          //   mathfield.typedText('^')
          // },
          // downOutOf: (mathfield: MathField) => {
          //   mathfield.typedText('_')
          // }
        }
        // ...(isAndroid()
        //   ? {
        //       substituteTextarea: alternativeTextArea,
        //       substituteKeyboardEvents: alternativeSaneKeyboard
        //     }
        //   : {})
      }}
    />
  )
}

export interface VisualEditorProps {
  element: MathElement
  onChange(element: MathElement): void
  onError(): void
}

interface MathquillProps {
  latex: MathElement['src']
  config: {
    supSubsRequireOperand: boolean
    autoCommands: string
    handlers: {
      moveOutOf?(dir: number): void
      deleteOutOf?(dir: number): void
      upOutOf?(value: VisualEditorValue): void
      downOutOf?(value: VisualEditorValue): void
      substituteTextarea?(): HTMLInputElement
      substituteKeyboardEvents?(
        el_: [HTMLInputElement],
        handler: KeyboardHandler
      ): void
    }
  }
  mathquillDidMount(value: VisualEditorValue): void
  onChange(value: VisualEditorValue): void
}

interface KeyboardHandler {
  typedText: (text: string) => void
  keystroke: (key: string, event: object) => void
}

interface VisualEditorValue {
  typedText(text: string): void
  latex(): string
  focus(): void
}
