import * as React from 'react'

import { ScMcExerciseProps } from '.'
import { useScMcExerciseConfig } from './config'
import { ScMcRendererInteractive } from './renderer-interactive'

export function ScMcExerciseRenderer(props: ScMcRendererProps) {
  const config = useScMcExerciseConfig(props.config)

  return (
    <ScMcRendererInteractive
      {...props}
      config={config}
      getFeedback={({ mistakes, missingSolutions }) => {
        if (mistakes > 0 && mistakes === missingSolutions) {
          return config.i18n.globalFeedback.missingCorrectAnswers
        }

        return undefined
      }}
      nextButtonStateAfterSubmit={({ button, answer }) => {
        return {
          selected: button.selected && answer.isCorrect.value,
          showFeedback: button.selected,
        }
      }}
      showFeedback
    />
  )
}

export type ScMcRendererProps = ScMcExerciseProps & {
  isEmpty: (id: string) => boolean
}
