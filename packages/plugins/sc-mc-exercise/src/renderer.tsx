import * as React from 'react'

import { ScMcExerciseProps } from '.'
import { ScMcRendererInteractive } from './renderer-interactive'

export function ScMcExerciseRenderer(props: ScMcRendererProps) {
  return (
    <ScMcRendererInteractive
      {...props}
      getFeedback={({ mistakes, missingSolutions }) => {
        if (mistakes > 0 && mistakes === missingSolutions) {
          return props.config.i18n.globalFeedback.missingCorrectAnswers
        }

        return undefined
      }}
      nextButtonStateAfterSubmit={({ button, answer }) => {
        return {
          selected: button.selected && answer.isCorrect.value,
          showFeedback: button.selected
        }
      }}
      showFeedback
    />
  )
}

export type ScMcRendererProps = ScMcExerciseProps & {
  isEmpty: (id: string) => boolean
}
