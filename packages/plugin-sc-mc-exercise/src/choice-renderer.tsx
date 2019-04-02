import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled, createPluginTheme, EditorThemeProps } from '@edtr-io/ui'

import * as React from 'react'
import { scMcState } from '.'

const createChoiceButtonTheme = createPluginTheme<ChoiceButtonTheme>(theme => {
  return {
    borderColor: 'transparent',
    borderStyle: '3px solid',
    hoverBorderColor: theme.highlightColor,
    correctBackgroundColor: '#95bc1a',
    wrongBackgroundColor: '#f7b07c',
    selectedBackgroundColor: theme.highlightColor,
    defaultBackgroundColor: theme.backgroundColor
  }
})

export class ScMcExerciseChoiceRenderer extends React.Component<
  StatefulPluginEditorProps<typeof scMcState> & ChoiceRendererProps
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

  private getBackgroundColor = (theme: ChoiceButtonTheme) => {
    const { showFeedback, selected, state, index } = this.props
    return showFeedback
      ? state.answers()[index].isCorrect()
        ? theme.correctBackgroundColor
        : theme.wrongBackgroundColor
      : selected
      ? theme.selectedBackgroundColor
      : theme.defaultBackgroundColor
  }

  private ChoiceButton = styled.div<{
    isCorrect?: boolean
    showFeedback?: boolean
    onClick?: ChoiceRendererProps['onClick']
  }>(
    ({
      isCorrect,
      showFeedback,
      onClick,
      ...props
    }: {
      isCorrect?: boolean
      showFeedback?: boolean
      onClick?: ChoiceRendererProps['onClick']
    } & EditorThemeProps) => {
      const theme = createChoiceButtonTheme('choiceButton', props.theme)
      return {
        borderBottom: `${theme.borderStyle} ${theme.borderColor}`,
        minWidth: '20px',
        backgroundColor: this.getBackgroundColor(theme),
        margin: '5px 0 0',
        paddingLeft: '5px',
        paddingTop: '10px',
        boxShadow: 'none',
        transition: 'background-color 0.5s ease',
        '&:hover': {
          borderBottom:
            (isCorrect && showFeedback) || !onClick
              ? undefined
              : `${theme.borderStyle} ${theme.hoverBorderColor}`
        },
        cursor:
          (isCorrect && showFeedback) || !onClick
            ? 'default !important'
            : undefined
      }
    }
  )

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

export interface ChoiceButtonTheme {
  borderColor: string
  borderStyle: string
  hoverBorderColor: string
  correctBackgroundColor: string
  wrongBackgroundColor: string
  selectedBackgroundColor: string
  defaultBackgroundColor: string
}
