import { styled } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { SolutionStepsProps } from '.'

const BigFlex = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

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

export function SolutionStepsRenderer(props: SolutionStepsProps) {
  const { state } = props
  const { introduction, strategy, solutionSteps, additionals } = state
  return (
    <React.Fragment>
      {introduction.render()}
      {strategy.render()}
      <BigFlex>
        {solutionSteps.map(solutionStep => {
          return (
            <React.Fragment key={solutionStep.content.id}>
              <Container isHalf={solutionStep.isHalf.value}>
                {solutionStep.content.render()}
              </Container>
            </React.Fragment>
          )
        })}
      </BigFlex>
      {additionals.render()}
    </React.Fragment>
  )
}
