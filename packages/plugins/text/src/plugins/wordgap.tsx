import {
  SubmitButton,
  InputExerciseField,
  ExerciseState,
  handleWrongAnswer
} from '@edtr-io/renderer-ui'
import isHotkey from 'is-hotkey'
import * as React from 'react'
import { Inline, Editor } from 'slate'
import S from 'string'
import {
  InlineEditorProps,
  NodeControlsProps,
  trimSelection,
  TextPlugin
} from '..'

export const wordgapNode = '@splish-me/wordgap'

export interface WordgapPluginOptions {
  EditorComponent?: React.ComponentType<InlineEditorProps>
  ControlsComponent?: React.ComponentType<NodeControlsProps>
}

function normalize(string: string) {
  const temp = S(string).collapseWhitespace()
  return S(S(temp.s).replaceAll(',', '.').s)
    .replaceAll(' /', '/')
    .replaceAll('/ ', '/').s
}

const isEqual = (word1: string, word2: string) => {
  const w1 = normalize(word1)
  const w2 = normalize(word2)
  return w1 === w2
}

export const isWordgap = (editor: Editor) => {
  return editor.value.inlines.some(inline =>
    inline ? inline.type === wordgapNode : false
  )
}

export const unsetWordgap = (editor: Editor) => {
  return editor.unwrapInline(wordgapNode)
}

export const setWordgap = (editor: Editor) => {
  const selection = document.getSelection()
  const correctValue = selection ? selection.toString() : ''
  if (editor.value.selection.isExpanded) {
    trimSelection(editor)
    return editor
      .wrapInline({
        type: wordgapNode,
        data: { correctValue: correctValue }
      })
      .moveToEnd()
      .focus()
      .moveBackward(1)
  }

  return editor
    .insertText('')
    .focus()
    .moveFocusBackward(1)
    .wrapInline({
      type: wordgapNode
    })
    .moveToStart()
}

const DefaultEditorComponent: React.FunctionComponent<
  InlineEditorProps
> = props => {
  const { readOnly } = props
  const [value, setValue] = React.useState(
    readOnly ? '' : props.node.data.get('correctValue') || ''
  )

  const getExerciseState = () => {
    const wordgap = props.node.data
    if (!wordgap.get('showFeedback')) {
      return ExerciseState.Default
    } else if (
      isEqual(wordgap.get('correctValue'), wordgap.get('currentValue'))
    ) {
      return ExerciseState.SolvedRight
    } else {
      return ExerciseState.SolvedWrong
    }
  }
  return !readOnly ? (
    <InputExerciseField
      exerciseState={ExerciseState.Default}
      value={value}
      width={10 + props.node.data.get('correctValue').length * 20}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        props.editor.setNodeByKey(props.node.key, {
          type: props.node.type,
          data: {
            ...props.node.data.toJS(),
            correctValue: e.target.value
          }
        })
        console.log(
          'correct:',
          props.node.data.get('correctValue'),
          ' current:',
          props.node.data.get('currentValue')
        )
        setValue(e.target.value)
      }}
      onFocus={() => {
        props.editor.moveTo(props.node.key)
      }}
      onKeyDown={e => {
        //39 right 37 left
        const target = e.target as HTMLInputElement
        const cursorPosition = target.selectionStart
        const correctValue = props.node.data.get('correctValue')
        if (cursorPosition === 0 && e.keyCode === 37) {
          props.editor
            .moveToStart()
            .moveBackward(1)
            .focus()
        } else if (cursorPosition === correctValue.length && e.keyCode === 39) {
          props.editor
            .moveToEnd()
            .moveForward(1)
            .focus()
        }
      }}
    />
  ) : (
    <InputExerciseField
      exerciseState={getExerciseState()}
      value={value}
      width={30 + props.node.data.get('correctValue').length * 30}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        props.editor.setNodeByKey(props.node.key, {
          type: props.node.type,
          data: {
            ...props.node.data.toJS(),
            showFeedback: false,
            currentValue: e.target.value
          }
        })
        setValue(e.target.value)
        console.log(
          'correct:',
          props.node.data.get('correctValue'),
          ' current:',
          props.node.data.get('currentValue')
        )
      }}
    />
  )
}

const DefaultControlsComponent: React.FunctionComponent<
  NodeControlsProps
> = props => {
  const { editor } = props
  const [exerciseState, setExerciseState] = React.useState<ExerciseState>(
    ExerciseState.Default
  )

  function nodeIsWordgap(inline: Inline | undefined) {
    return inline ? inline.type === wordgapNode : false
  }

  return (
    <React.Fragment>
      {props.children}
      {editor.value.document.getInlines().find(nodeIsWordgap) ? (
        <SubmitButton
          disabled={!props.readOnly}
          exerciseState={exerciseState}
          onClick={() => {
            editor.focus()
            editor.value.document
              .getInlines()
              .filter(item => nodeIsWordgap(item))
              .forEach(item => {
                if (item) {
                  if (
                    !isEqual(
                      item.data.get('correctValue'),
                      item.data.get('currentValue')
                    )
                  ) {
                    handleWrongAnswer(setExerciseState)
                  }
                  editor.setNodeByKey(item.key, {
                    type: item.type,
                    data: { ...item.data.toJS(), showFeedback: true }
                  })
                }
              })
          }}
        ></SubmitButton>
      ) : null}
      <div style={{ clear: 'both' }} />
    </React.Fragment>
  )
}

export const createWordgapPlugin = ({
  EditorComponent = DefaultEditorComponent,
  ControlsComponent = DefaultControlsComponent
}: WordgapPluginOptions = {}) => (): TextPlugin => {
  return {
    onKeyDown(event, editor, next) {
      const e = (event as unknown) as KeyboardEvent
      if (isHotkey('mod+g', e)) {
        e.preventDefault()
        return isWordgap(editor) ? unsetWordgap(editor) : setWordgap(editor)
      }

      return next()
    },
    renderInline(props, _editor, next) {
      const block = props.node

      if (block.type === wordgapNode) {
        return <EditorComponent {...props} />
      }

      return next()
    },
    renderEditor(props, editor, next) {
      const children = next()

      return (
        <ControlsComponent {...props} editor={editor}>
          {children}
        </ControlsComponent>
      )
    }
  }
}
