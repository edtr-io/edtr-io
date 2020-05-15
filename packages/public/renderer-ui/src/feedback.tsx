import { styled } from '@edtr-io/ui'
import * as React from 'react'

const ContainerWithBox = styled.div<ContainerProps>({
  backgroundColor: '#fcf8e3',
  borderColor: '#faebcc',
  color: '#8a6d3b',
  padding: '15px',
})

const ContainerWithoutBox = styled.div<ContainerProps>(
  ({ correct, showOnLeft }) => {
    return {
      color: correct ? '#95bc1a' : '#f7b07c',
      fontWeight: 'bold',
      textAlign: showOnLeft ? 'left' : 'right',
    }
  }
)

interface ContainerProps {
  correct?: boolean
  showOnLeft?: boolean
}

/**
 * @param props - The props
 * @internal
 */
export function Feedback(props: FeedbackProps) {
  const { boxFree, children, isTrueAnswer, showOnLeft } = props
  const Container = boxFree ? ContainerWithoutBox : ContainerWithBox

  return (
    <Container correct={isTrueAnswer} showOnLeft={showOnLeft}>
      {children}
    </Container>
  )
}

/** @internal */
export interface FeedbackProps {
  children?: React.ReactNode
  boxFree?: boolean
  isTrueAnswer?: boolean
  showOnLeft?: boolean
}
