import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { solutionStepsState } from '.'
import { BigFlex } from './editor'
import { styled } from '@edtr-io/renderer-ui'

const Container = styled.div<{ isHalf: boolean }>(
  ({ isHalf }: { isHalf: boolean }) => {
    return {
      width: isHalf ? '50%' : '100%',
      '@media (max-width: 650px)': {
        width: '100%'
      }
    }
  }
)

export function SolutionStepsRenderer(
  props: StatefulPluginEditorProps<typeof solutionStepsState>
) {
  const { state } = props
  const { introduction, solutionSteps } = state
  return (
    <React.Fragment>
      {introduction.render()}
      <BigFlex>
        {solutionSteps.map((solutionStep, index) => {
          return (
            <React.Fragment>
              <Container isHalf={solutionStep.isHalf.value}>
                {solutionStep.content.render()}
              </Container>
            </React.Fragment>
          )
        })}
      </BigFlex>
    </React.Fragment>
  )
}
