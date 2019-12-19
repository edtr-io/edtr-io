import { useScopedSelector } from '@edtr-io/core'
import {
  PreviewOverlay,
  InteractiveAnswer,
  AddButton
} from '@edtr-io/editor-ui'
import { PluginEditorProps } from '@edtr-io/plugin'
import { getFocused, isEmpty as isEmptySelector } from '@edtr-io/store'
import * as R from 'ramda'
import * as React from 'react'

import { scMcExerciseState } from '.'
import { ScMcExerciseRenderer } from './renderer'

export function ScMcExerciseEditor(
  props: PluginEditorProps<typeof scMcExerciseState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) {
  const focusedElement = useScopedSelector(getFocused())
  const isEmpty = useScopedSelector(state => (id: string) =>
    isEmptySelector(id)(state)
  )
  const { editable, focused, state } = props
  const children = R.flatten(
    props.state.answers.map(answer => {
      return [answer.id.id, answer.feedback.id]
    })
  )
  const handleCheckboxChange = (index: number) => () => {
    const { state } = props
    state.answers[index].isCorrect.set(currentVal => !currentVal)
  }

  const handleRadioButtonChange = (rightanswerIndex: number) => () => {
    const { state } = props
    state.answers.forEach((answer, index) => {
      answer.isCorrect.set(index === rightanswerIndex)
    })
  }

  const handleSCMCChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { state } = props

    state.isSingleChoice.set(event.target.value === 'Single Choice')
    state.isSingleChoice.value &&
      state.answers.forEach(answer => {
        answer.isCorrect.set(false)
      })
  }

  const addButton = () => {
    const { state } = props

    state.answers.insert()
  }

  const removeAnswer = (index: number) => () => {
    const { state } = props
    state.answers.remove(index)
  }

  const nestedFocus = focused || R.includes(focusedElement, children)
  const [previewActive, setPreviewActive] = React.useState(false)

  if (!editable) {
    return <ScMcExerciseRenderer {...props} isEmpty={isEmpty} />
  }

  const Controls = (
    <React.Fragment>
      Wähle den Aufgabentyp:
      <select
        value={state.isSingleChoice.value ? 'Single Choice' : 'Multiple Choice'}
        onChange={handleSCMCChange}
      >
        <option value="Multiple Choice">Multiple Choice</option>
        <option value="Single Choice">Single Choice</option>
      </select>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <PreviewOverlay
        focused={nestedFocus || false}
        onChange={setPreviewActive}
        editable={previewActive}
      >
        <ScMcExerciseRenderer {...props} isEmpty={isEmpty} />
      </PreviewOverlay>
      {editable ? (
        <div>
          {nestedFocus && !previewActive ? (
            <React.Fragment>
              {state.answers.map((answer, index) => {
                return (
                  <InteractiveAnswer
                    key={answer.id.id}
                    answer={answer.id.render()}
                    answerID={answer.id.id}
                    feedback={answer.feedback.render()}
                    feedbackID={answer.feedback.id}
                    focusedElement={focusedElement || undefined}
                    isRadio={state.isSingleChoice.value}
                    isActive={answer.isCorrect.value}
                    remove={removeAnswer(index)}
                    handleChange={
                      state.isSingleChoice.value
                        ? handleRadioButtonChange(index)
                        : handleCheckboxChange(index)
                    }
                  />
                )
              })}
              <AddButton onClick={addButton}>Antwort hinzufügen...</AddButton>
              {!props.renderIntoExtendedSettings ? (
                <React.Fragment>
                  <hr />
                  {Controls}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : null}
          {props.renderIntoExtendedSettings
            ? props.renderIntoExtendedSettings(Controls)
            : null}
        </div>
      ) : null}
    </React.Fragment>
  )
}
