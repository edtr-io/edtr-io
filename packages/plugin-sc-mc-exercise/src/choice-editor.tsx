import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faPlus, faTrashAlt, styled } from '@edtr-io/editor-ui'
import * as React from 'react'

import { ScMcExerciseChoiceRenderer } from './choice-renderer'
import { scMcExerciseState } from '.'

export class ScMcChoiceEditor extends React.Component<
  StatefulPluginEditorProps<typeof scMcExerciseState> & { index: number }
> {
  public render() {
    const { editable, state, index } = this.props
    return (
      <React.Fragment>
        {editable ? (
          <this.EditorUiContainer>
            <this.RemoveButton
              onClick={this.removeAnswer}
              className="btn btn-default"
            >
              <Icon icon={faTrashAlt} />
            </this.RemoveButton>
            {state.answers()[index].isCorrect() ? null : (
              <button onClick={this.addFeedback} className="btn btn-default">
                {state.answers()[index].feedback() ? (
                  <span>
                    <Icon icon={faTrashAlt} /> Feedback
                  </span>
                ) : (
                  <span>
                    <Icon icon={faPlus} /> Feedback
                  </span>
                )}
              </button>
            )}
          </this.EditorUiContainer>
        ) : null}
        <this.ContentContainer>
          <ScMcExerciseChoiceRenderer {...this.props} />
        </this.ContentContainer>
      </React.Fragment>
    )
  }

  private addFeedback = () => {
    const { state, index } = this.props
    state.answers()[index].hasFeedback.set(true)
  }

  private removeAnswer = () => {
    const { state, index } = this.props
    state.answers.remove(index)
  }

  private EditorUiContainer = styled.div({
    float: 'right'
  })

  private ContentContainer = styled.div({
    clear: 'both'
  })

  private RemoveButton = styled.button({
    marginRight: '5px'
  })
}
