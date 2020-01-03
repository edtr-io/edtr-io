import {
  child,
  object,
  list,
  string,
  boolean,
  EditorPluginProps,
  EditorPlugin
} from '@edtr-io/plugin'
import { name as rowsPlugin } from '@edtr-io/plugin-rows/__fixtures__'
import { name as textPlugin } from '@edtr-io/plugin-text/__fixtures__'

import { SolutionStepsEditor } from './editor'
import * as Guidelines from './helper/guideline-texts'

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

export type SolutionStepsState = ReturnType<typeof createSolutionStepState>
export type SolutionStepsProps = EditorPluginProps<SolutionStepsState, Config>
interface Component {
  options: Parameters<typeof child>
  guideline: React.ReactNode
  placeholder: string
}
export interface Config {
  introduction: Component
  strategy: Component
  step: Component
  explanation: Component
  additionals: Component
}

export function createSolutionStepsPlugin({
  introduction = {
    options: [{ plugin: textPlugin }],
    guideline: Guidelines.introductionGuideline,
    placeholder: Guidelines.introductionLabel
  },
  strategy = {
    options: [{ plugin: rowsPlugin }],
    guideline: Guidelines.strategyGuideline,
    placeholder: Guidelines.strategyLabel
  },
  step = {
    options: [{ plugin: rowsPlugin }],
    guideline: Guidelines.stepGuideline,
    placeholder: Guidelines.stepLabel
  },
  explanation = {
    options: [{ plugin: rowsPlugin }],
    guideline: Guidelines.explanationGuideline,
    placeholder: Guidelines.explanationLabel
  },
  additionals = {
    options: [{ plugin: rowsPlugin }],
    guideline: Guidelines.additionalsGuideline,
    placeholder: Guidelines.additionalsLabel
  }
}: {
  introduction?: Component
  strategy?: Component
  step?: Component
  explanation?: Component
  additionals?: Component
} = {}): EditorPlugin<SolutionStepsState, Config> {
  return {
    Component: SolutionStepsEditor,
    state: createSolutionStepState(
      introduction.options,
      strategy.options,
      step.options,
      additionals.options
    ),
    config: {
      introduction,
      strategy,
      step,
      explanation,
      additionals
    }
  }
}
