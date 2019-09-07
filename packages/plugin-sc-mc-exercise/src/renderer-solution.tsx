import {
  StateDescriptorReturnType,
  StatefulPluginEditorProps
} from '@edtr-io/plugin'
import * as React from 'react'

import { AnswerProps, scMcExerciseState } from '.'
import { ScMcAnswersRenderer } from './answers-renderer'
import { ScMcExerciseChoiceRenderer } from './choice-renderer'

export class ScMcRendererSolution extends React.Component<
  StatefulPluginEditorProps<typeof scMcExerciseState>
> {
  public render() {
    return <ScMcAnswersRenderer {...this.props} showAnswer={this.showAnswer} />
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
