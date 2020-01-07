import { StateTypeReturnType } from '@edtr-io/plugin'
import * as React from 'react'

import { ScMcExerciseProps, ScMcExerciseState } from '.'
import { ScMcAnswersRenderer } from './answers-renderer'
import { ScMcExerciseChoiceRenderer } from './choice-renderer'

export class ScMcRendererSolution extends React.Component<ScMcExerciseProps> {
  public render() {
    return <ScMcAnswersRenderer {...this.props} showAnswer={this.showAnswer} />
  }

  private showAnswer = (
    answer: StateTypeReturnType<ScMcExerciseState>['answers'][0],
    index: number,
    centered: boolean
  ): React.ReactNode => {
    return (
      <ScMcExerciseChoiceRenderer
        key={index}
        index={index}
        selected={answer.isCorrect.value}
        showFeedback
        {...this.props}
        centered={centered}
      >
        {answer.id.render()}
      </ScMcExerciseChoiceRenderer>
    )
  }
}
