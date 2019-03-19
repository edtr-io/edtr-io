import * as React from 'react'

import { ScMcExerciseChoiceRenderer } from './choice-renderer'
import { AnswerProps, scMcState } from '.'
import { ScMcAnswersRenderer } from './answers-renderer'
import {
  StateDescriptorReturnType,
  StatefulPluginEditorProps
} from '@edtr-io/core'

export class ScMcRendererSolution extends React.Component<
  StatefulPluginEditorProps<typeof scMcState>
> {
  public render() {
    return (
      <ScMcAnswersRenderer
        state={this.props.state}
        showAnswer={this.showAnswer}
      />
    )
  }

  private showAnswer = (
    answer: StateDescriptorReturnType<typeof AnswerProps>,
    index: number,
    centered: boolean
  ): React.ReactNode => {
    return (
      <ScMcExerciseChoiceRenderer
        key={index}
        index={index}
        selected={answer.isCorrect()}
        showFeedback
        {...this.props}
        centered={centered}
      >
        {answer.id.render()}
      </ScMcExerciseChoiceRenderer>
    )
  }
}
