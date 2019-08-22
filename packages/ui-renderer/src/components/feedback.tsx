import * as React from 'react'

import { styled, createRendererUiTheme, RendererThemeProps } from '../theme'

export const createFeedbackTheme = createRendererUiTheme<FeedbackTheme>(
  theme => {
    return {
      color: theme.success.color,
      successColor: theme.success.background,
      failureColor: theme.warning.background,
      borderSuccessColor: 'green',
      borderFailureColor: '#faebcc'
    }
  }
)

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

  private BoxFreeContainer = styled.div<
    {
      correct?: boolean
      showOnLeft?: boolean
    } & RendererThemeProps
  >(({ correct, showOnLeft, theme }) => {
    const { successColor, failureColor } = createFeedbackTheme(
      'feedback',
      theme
    )
    return {
      color: correct ? successColor : failureColor,
      fontWeight: 'bold',
      textAlign: showOnLeft ? 'left' : 'right'
    }
  })

  private BoxContainer = styled.div<{ correct?: boolean } & RendererThemeProps>(
    ({ correct, theme }) => {
      const {
        successColor,
        failureColor,
        color,
        borderSuccessColor,
        borderFailureColor
      } = createFeedbackTheme('feedback', theme)

      return {
        backgroundColor: correct ? successColor : failureColor,
        borderColor: correct ? borderSuccessColor : borderFailureColor,
        color,
        padding: '15px'
      }
    }
  )
}

export interface FeedbackProps {
  boxFree?: boolean
  isTrueAnswer?: boolean
  showOnLeft?: boolean
}

export interface FeedbackTheme {
  color: string
  successColor: string
  failureColor: string
  borderSuccessColor: string
  borderFailureColor: string
}
