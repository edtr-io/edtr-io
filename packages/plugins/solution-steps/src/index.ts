import {
  child,
  object,
  list,
  string,
  boolean,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'

import { SolutionStepsEditor, explanation } from './editor'

function createSolutionStepState(
  introduction: Parameters<typeof child>,
  strategy: Parameters<typeof child>,
  solutionStep: Parameters<typeof child>,
  additionals: Parameters<typeof child>
) {
  const solutionStepState = object({
    type: string('step'),
    isHalf: boolean(),
    content: child(...solutionStep)
  })
  return object({
    introduction: child(...introduction),
    strategy: child(...strategy),
    hasStrategy: boolean(),
    solutionSteps: list(solutionStepState),
    additionals: child(...additionals),
    hasAdditionals: boolean()
  })
}

// export const solutionStep = object({
//   type: string('step'),
//   isHalf: boolean(),
//   content: child('rows')
// })

// export const solutionStepsState = object({
//   introduction: child('text'),
//   strategy: child('rows'),
//   hasStrategy: boolean(),
//   solutionSteps: list(solutionStep),
//   additionals: child('rows'),
//   hasAdditionals: boolean()
// })

export type SolutionStepsState = ReturnType<typeof createSolutionStepState>
export type SolutionStepsProps = EditorPluginProps<SolutionStepsState>

export function createSolutionStepsPlugin({
  introduction = [],
  strategy = [],
  solutionStep = [],
  additionals = []
}: {
  introduction?: Parameters<typeof child>
  strategy?: Parameters<typeof child>
  solutionStep?: Parameters<typeof child>
  additionals?: Parameters<typeof child>
} = {}): EditorPlugin<SolutionStepsState> {
  return {
    Component: SolutionStepsEditor,
    state: createSolutionStepState(
      introduction,
      strategy,
      solutionStep,
      additionals
    ),
    config: {}
  }
}
