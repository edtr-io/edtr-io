import { useScopedSelector, useScopedStore } from '@edtr-io/core'
import {
  AddButton,
  InteractiveAnswer,
  PreviewOverlay,
} from '@edtr-io/editor-ui/internal'
import { getFocused, isEmpty as isEmptySelector } from '@edtr-io/store'
import * as R from 'ramda'
import * as React from 'react'

import { ScMcExerciseProps } from '.'
import { ScMcExerciseRenderer } from './renderer'

export function ScMcExerciseEditor(props: ScMcExerciseProps) {
  const store = useScopedStore()
  const focusedElement = useScopedSelector(getFocused())

  const { editable, focused, state } = props
  const children = R.flatten(
    props.state.answers.map((answer) => {
      return [answer.content.id, answer.feedback.id]
    })
  )
  const handleCheckboxChange = (index: number) => () => {
    const { state } = props
    state.answers[index].isCorrect.set((currentVal) => !currentVal)
  }

  const handleRadioButtonChange = (rightanswerIndex: number) => () => {
    const { state } = props
    state.answers.forEach((answer, index) => {
      answer.isCorrect.set(index === rightanswerIndex)
    })
  }

  const handleSCMCChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { state } = props

    state.isSingleChoice.set(event.target.value === 'sc')
    state.isSingleChoice.value &&
      state.answers.forEach((answer) => {
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

  return (
    <React.Fragment>
      <PreviewOverlay
        focused={nestedFocus || false}
        onChange={setPreviewActive}
        editable={previewActive}
      >
        <ScMcExerciseRenderer {...props} isEmpty={isEmpty} />
      </PreviewOverlay>
      {editable && nestedFocus && !previewActive && (
        <React.Fragment>
          {state.answers.map((answer, index) => {
            return (
              <InteractiveAnswer
                key={answer.content.id}
                answer={answer.content.render()}
                answerID={answer.content.id}
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
          <AddButton onClick={addButton}>
            {props.config.i18n.answer.addLabel}
          </AddButton>
        </React.Fragment>
      )}
      {props.renderIntoSettings(
        <React.Fragment>
          <label htmlFor="scMcType">
            {props.config.i18n.isSingleChoice.label}:
          </label>{' '}
          <select
            id="scMcType"
            value={state.isSingleChoice.value ? 'sc' : 'mc'}
            onChange={handleSCMCChange}
          >
            <option value="mc">{props.config.i18n.types.multipleChoice}</option>
            <option value="sc">{props.config.i18n.types.singleChoice}</option>
          </select>
        </React.Fragment>
      )}
    </React.Fragment>
  )

  function isEmpty(id: string) {
    return isEmptySelector(id)(store.getState())
  }
}
