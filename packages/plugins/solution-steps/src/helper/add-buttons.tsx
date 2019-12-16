import { useScopedSelector } from '@edtr-io/core'
import { AddButton } from '@edtr-io/editor-ui'
import { hasFocusedDescendant } from '@edtr-io/store'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { solutionStepsState } from '..'
import { explanation } from '../editor'
import { addStepLabel, addExplanationLabel } from '../guideline-texts'
import { Buttoncontainer } from './styled-elements'
import * as React from 'react'

export function AddButtonsComponent(
  props: StatefulPluginEditorProps<typeof solutionStepsState> & {
    id: string
    index: number
  }
) {
  const hasFocusedChild = useScopedSelector(hasFocusedDescendant(props.id))

  const insertStep = () => {
    props.state.solutionSteps.insert(props.index + 1)
  }
  const insertExplanation = () => {
    props.state.solutionSteps.insert(props.index + 1, {
      type: explanation,
      content: { plugin: 'rows' },
      isHalf: false
    })
  }
  return (
    <React.Fragment>
      {hasFocusedChild || props.id === '' ? (
        <Buttoncontainer>
          <AddButton title={addStepLabel} onClick={insertStep}>
            Lösungsbestandteil
          </AddButton>
          <AddButton title={addExplanationLabel} onClick={insertExplanation}>
            zusätzliche Erklärung
          </AddButton>
        </Buttoncontainer>
      ) : null}
    </React.Fragment>
  )
}
