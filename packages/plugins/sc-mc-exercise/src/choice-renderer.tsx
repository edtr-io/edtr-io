import { CheckElement } from '@edtr-io/editor-ui/internal'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { ScMcExerciseProps } from '.'

const CheckboxContainer = styled.div({
  //width: '5%',
  textAlign: 'center',
  marginRight: '10px',
  marginBottom: '5px',
  fontWeight: 'bold',
})
export class ScMcExerciseChoiceRenderer extends React.Component<
  ScMcExerciseProps & ChoiceRendererProps
> {
  public render() {
    const { state, children, index, onClick, showFeedback, selected } =
      this.props
    return (
      <div style={{ display: 'flex' }}>
        <CheckboxContainer>
          <CheckElement
            isRadio={state.isSingleChoice.value}
            isActive={selected || false}
            handleChange={onClick ? onClick : () => {}}
          />
        </CheckboxContainer>
        <this.Container
          isCorrect={state.answers[index].isCorrect.value}
          showFeedback={showFeedback || false}
        >
          {children}
        </this.Container>
      </div>
    )
  }
  private Container = styled.div<{ isCorrect: boolean; showFeedback: boolean }>(
    (props) => {
      return {
        paddingLeft: '20 px',
        color: props.showFeedback
          ? props.isCorrect
            ? '#95bc1a'
            : '#f7b07c'
          : 'black',
      }
    }
  )
}

export interface ChoiceRendererProps {
  index: number
  onClick?: (event: React.MouseEvent<Element>) => void
  showFeedback?: boolean
  centered?: boolean
  selected?: boolean
}
