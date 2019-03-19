import * as React from 'react'

import { styled } from './styled'

export class Feedback extends React.Component<FeedbackProps> {
  public render() {
    const { boxFree, children, isTrueAnswer } = this.props
    const Container = boxFree ? this.BoxFreeContainer : this.BoxContainer

    return <Container correct={isTrueAnswer}>{children}</Container>
  }

  private BoxFreeContainer = styled.div<{ correct?: boolean }>(
    ({ correct }) => {
      return {
        color: correct ? '#95bc1a' : '#f7b07c',
        fontWeight: 'bold',
        textAlign: 'right'
      }
    }
  )

  private BoxContainer = styled.div<{ correct?: boolean }>({
    backgroundColor: '#fcf8e3',
    borderColor: '#faebcc',
    color: '#8a6d3b',
    padding: '15px'
  })
}

export interface FeedbackProps {
  boxFree?: boolean
  isTrueAnswer?: boolean
}
