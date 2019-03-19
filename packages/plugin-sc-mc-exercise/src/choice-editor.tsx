import { Icon, faPlus, faTrashAlt, styled } from '@edtr-io/ui'
import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { scMcState } from '.'
import { ScMcExerciseChoiceRenderer } from './choice-renderer'

export class ScMcChoiceEditor extends React.Component<
  StatefulPluginEditorProps<typeof scMcState> & { index: number }
> {
  render() {
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

  addFeedback = () => {
    const { state, index } = this.props
    state.answers()[index].hasFeedback.set(true)
  }

  removeAnswer = () => {
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
