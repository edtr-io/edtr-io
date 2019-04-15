import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faPlus } from '@edtr-io/editor-ui'
import { Feedback, styled } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { ScMcChoiceEditor } from './choice-editor'
import { ScMcExerciseRenderer } from './renderer'
import { scMcState } from '.'

export class ScMcExerciseEditor extends React.Component<
  StatefulPluginEditorProps<typeof scMcState>
> {
  public render() {
    const { editable, state, focused } = this.props
    return (
      <React.Fragment>
        {!editable ? (
          <ScMcExerciseRenderer state={state} />
        ) : (
          <React.Fragment>
            <hr />
            {state.answers().map((answer, index) => {
              return (
                <this.AnswerContainer key={index}>
                  <this.AnswerLabel>
                    <span>richtige Antwort</span>

                    <input
                      checked={answer.isCorrect()}
                      type={state.isSingleChoice() ? 'radio' : 'checkbox'}
                      onChange={
                        state.isSingleChoice()
                          ? this.handleRadioButtonChange(index)
                          : this.handleCheckboxChange(index)
                      }
                    />
                  </this.AnswerLabel>

                  <ScMcChoiceEditor key={index} index={index} {...this.props}>
                    {answer.id.render()}
                  </ScMcChoiceEditor>
                  {answer.hasFeedback() ? (
                    <Feedback>{answer.feedback.render()}</Feedback>
                  ) : null}
                </this.AnswerContainer>
              )
            })}

            <this.AddButtonContainer>
              <this.AddButton onClick={this.addButton}>
                <Icon icon={faPlus} />
              </this.AddButton>
            </this.AddButtonContainer>
          </React.Fragment>
        )}
        {focused ? (
          <React.Fragment>
            <hr />
            Select the exercise type:
            <select
              value={
                state.isSingleChoice() ? 'Single Choice' : 'Multiple Choice'
              }
              onChange={this.handleSCMCChange}
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="Single Choice">Single Choice</option>
            </select>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }

  private handleCheckboxChange = (index: number) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.target
    const value = target.checked

    const { state } = this.props

    state.answers()[index].isCorrect.set(value)
  }

  private handleRadioButtonChange = (rightanswerIndex: number) => () => {
    const { state } = this.props
    state.answers().forEach((answer, index) => {
      answer.isCorrect.set(index === rightanswerIndex)
    })
  }

  private handleSCMCChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { state } = this.props

    state.isSingleChoice.set(event.target.value === 'Single Choice')
    state.isSingleChoice() &&
      state.answers().forEach(answer => {
        answer.isCorrect.set(false)
      })
  }

  private addButton = () => {
    const { state } = this.props

    state.answers.insert()
  }

  private AnswerContainer = styled.div({
    marginBottom: '10px'
  })

  private AnswerLabel = styled.label({
    float: 'left',
    margin: '10px 0',

    span: {
      marginRight: '10px',
      paddingBottom: '5px'
    }
  })

  private AddButtonContainer = styled.div({
    textAlign: 'center'
  })

  private AddButton = styled.button({
    borderRadius: '50%',
    outline: 'none',
    width: '35px',
    height: '35px',
    border: 'none',
    margin: 'auto'
  })
}
