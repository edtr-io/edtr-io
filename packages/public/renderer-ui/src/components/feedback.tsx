/**
 * @module @edtr-io/renderer-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { styled } from '@edtr-io/ui'
import * as React from 'react'

/** @public */
export class Feedback extends React.Component<FeedbackProps> {
  public render() {
    const { boxFree, children, isTrueAnswer, showOnLeft } = this.props
    const Container = boxFree ? this.BoxFreeContainer : this.BoxContainer

    return (
      <Container correct={isTrueAnswer} showOnLeft={showOnLeft}>
        {children}
      </Container>
    )
  }

  private BoxFreeContainer = styled.div<{
    correct?: boolean
    showOnLeft?: boolean
  }>(({ correct, showOnLeft }) => {
    return {
      color: correct ? '#95bc1a' : '#f7b07c',
      fontWeight: 'bold',
      textAlign: showOnLeft ? 'left' : 'right'
    }
  })

  private BoxContainer = styled.div<{ correct?: boolean }>({
    backgroundColor: '#fcf8e3',
    borderColor: '#faebcc',
    color: '#8a6d3b',
    padding: '15px'
  })
}

/** @public */
export interface FeedbackProps {
  boxFree?: boolean
  isTrueAnswer?: boolean
  showOnLeft?: boolean
}
