import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { scMcExerciseState } from '.'
import { SCMCInput } from './button'

const CheckboxContainer = styled.div({
  //width: '5%',
  textAlign: 'center',
  marginRight: '10px',
  marginBottom: '5px',
  fontWeight: 'bold'
})
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
      selected
    } = this.props
    return (
      <div style={{ display: 'flex' }}>
        <CheckboxContainer>
          <SCMCInput
            isSingleChoice={state.isSingleChoice()}
            isActive={selected || false}
            handleChange={onClick ? onClick : () => {}}
          />
        </CheckboxContainer>
        <this.Container
          isCorrect={state.answers()[index].isCorrect()}
          showFeedback={showFeedback || false}
        >
          {children}
        </this.Container>
      </div>
    )
  }
  private Container = styled.div<{ isCorrect: boolean; showFeedback: boolean }>(
    props => {
      return {
        paddingLeft: '20 px',
        color: props.showFeedback
          ? props.isCorrect
            ? '#95bc1a'
            : '#f7b07c'
          : 'black'
      }
    }
  )

  private ChoiceButton = styled.div<{
    isCorrect?: boolean
    showFeedback?: boolean
    onClick?: ChoiceRendererProps['onClick']
  }>(({ isCorrect, showFeedback, onClick }) => {
    return {
      // minWidth: '20px',
      // backgroundColor: this.getBackgroundColor(),

      paddingLeft: '20px',
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
  onClick?: (event: React.MouseEvent<Element>) => void
  showFeedback?: boolean
  centered?: boolean
  selected?: boolean
}
