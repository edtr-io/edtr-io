import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'

import * as React from 'react'
import { scMcExerciseState } from '.'

export class ScMcExerciseChoiceRenderer extends React.Component<
  StatefulPluginEditorProps<typeof scMcExerciseState> & ChoiceRendererProps
> {
  public render() {
    const {
      state,
      children,
      index,
      onClick,
      showFeedback,
      centered
    } = this.props
    const Container = centered ? this.Block : React.Fragment
    return (
      <this.ChoiceButton
        isCorrect={state.answers()[index].isCorrect()}
        showFeedback={showFeedback}
        onClick={
          state.answers()[index].isCorrect() && showFeedback
            ? undefined
            : onClick
        }
      >
        <Container>{children}</Container>
      </this.ChoiceButton>
    )
  }

  private getBackgroundColor = () => {
    const { showFeedback, selected, state, index } = this.props
    return showFeedback
      ? state.answers()[index].isCorrect()
        ? '#95bc1a'
        : '#f7b07c'
      : selected
      ? '#d9edf7'
      : '#f8f8f8'
  }

  private ChoiceButton = styled.div<{
    isCorrect?: boolean
    showFeedback?: boolean
    onClick?: ChoiceRendererProps['onClick']
  }>(({ isCorrect, showFeedback, onClick }) => {
    return {
      borderBottom: '3px solid transparent',
      minWidth: '20px',
      backgroundColor: this.getBackgroundColor(),
      margin: '5px 0 0',
      paddingLeft: '5px',
      paddingTop: '10px',
      boxShadow: 'none',
      transition: 'background-color 0.5s ease',
      '&:hover': {
        borderBottom:
          (isCorrect && showFeedback) || !onClick
            ? undefined
            : '3px solid #d9edf7'
      },
      cursor:
        (isCorrect && showFeedback) || !onClick
          ? 'default !important'
          : undefined
    }
  })

  private Block = styled.div({
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  })
}

export interface ChoiceRendererProps {
  index: number
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  showFeedback?: boolean
  centered?: boolean
  selected?: boolean
}
