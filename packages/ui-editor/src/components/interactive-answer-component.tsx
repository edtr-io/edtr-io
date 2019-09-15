import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { Icon, faTimes, faPlus } from './icon'

export const AddButtonComponent = styled.button({
  marginLeft: 'calc(10% + 20px)',
  width: 'calc(90% - 20px)',
  borderRadius: '10px',
  backgroundColor: 'white',
  textAlign: 'left',
  color: 'lightgrey',
  minHeight: '50px',
  border: '2px solid lightgrey',
  outline: 'none',
  '&:hover': { border: '3px solid #007ec1', color: '#007ec1' }
})

export function AddButton(props: { onClick: () => void; children: string }) {
  return (
    <AddButtonComponent onClick={props.onClick}>
      <Icon icon={faPlus} /> {props.children}
    </AddButtonComponent>
  )
}

const AnswerContainer = styled.div({
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center'
})

const CheckboxContainer = styled.div({
  width: '10%',
  textAlign: 'center',
  marginRight: '10px',
  fontWeight: 'bold'
})

const FramedContainer = styled.div<{ focused: boolean }>(({ focused }) => {
  return {
    width: '100%',
    marginLeft: '10px',
    borderRadius: '10px',
    border: focused ? '3px solid #007ec1' : '2px solid lightgrey'
  }
})
const RemoveButton = styled.button<{ focused: boolean }>(({ focused }) => {
  return {
    borderRadius: '50%',
    outline: 'none',
    background: 'white',
    color: focused ? ' #007ec1' : 'lightgrey',
    border: focused ? '3px solid #007ec1' : '2px solid lightgrey',
    zIndex: 20,
    float: 'right',
    transform: 'translate(50%, -40%)',
    '&:hover': {
      border: '3px solid #007ec1',
      color: '#007ec1'
    }
  }
})
const AnswerField = styled.div({ paddingLeft: '20px', paddingTop: '10px' })

const FeedbackField = styled.div<{ focused: boolean }>(({ focused }) => {
  return {
    paddingLeft: '20px',
    paddingBottom: '10px',
    paddingTop: '10px',
    marginTop: '5px',
    borderTop: focused ? '2px solid #007ec1' : '2px solid lightgrey'
  }
})

const Container = styled.div<{ isRadio: boolean; checked: boolean }>(
  ({ isRadio, checked }) => {
    return {
      cursor: 'pointer',
      border: checked
        ? isRadio
          ? '5px solid #007ec1'
          : '2px solid #007ec1'
        : '2px solid lightgray',
      borderRadius: isRadio ? '50%' : '15%',
      width: '20px',
      height: '20px',
      display: 'inline-block',
      verticalAlign: 'middle',
      backgroundColor: checked && !isRadio ? '#007ec1' : 'white'
    }
  }
)

const Tick = styled.div<{ checked: boolean }>(({ checked }) => {
  return {
    opacity: checked ? 1 : 0,
    content: '',
    position: 'absolute',

    fontWeight: 'bold',
    width: '15px',
    height: '10px',
    border: '3px solid white',
    borderTop: 'none',
    borderRight: 'none',
    borderRadius: '2px',
    zIndex: 10,
    transform: 'rotate(-45deg)'
  }
})

export class CheckElement extends React.Component<SCMCInputProps> {
  public render() {
    const { isRadio, isActive, handleChange } = this.props
    return (
      <Container
        isRadio={isRadio}
        checked={isActive}
        onClick={e => {
          handleChange(e)
        }}
      >
        {isRadio ? null : <Tick checked={isActive} />}
      </Container>
    )
  }
}

export function InteractiveAnswer(props: {
  isRadio?: boolean
  isActive?: boolean
  handleChange: () => void
  answerID?: string
  feedbackID: string
  answer: HTMLInputElement | React.ReactNode
  feedback: React.ReactNode
  focusedElement?: string
  remove: () => void
}) {
  return (
    <AnswerContainer>
      <CheckboxContainer>
        Richtig?
        <CheckElement
          isRadio={props.isRadio || false}
          isActive={props.isActive || false}
          handleChange={props.handleChange}
        />
      </CheckboxContainer>
      {/* TODO: Change Placeholder to "Antwort" und "Feedback", Dependency Plugin Config */}
      <FramedContainer
        focused={
          props.answerID === props.focusedElement ||
          props.feedbackID === props.focusedElement
        }
      >
        <AnswerField>{props.answer}</AnswerField>
        <RemoveButton
          focused={
            props.answerID === props.focusedElement ||
            props.feedbackID === props.focusedElement
          }
          onClick={props.remove}
        >
          <Icon icon={faTimes} />
        </RemoveButton>
        <FeedbackField
          focused={
            props.answerID === props.focusedElement ||
            props.feedbackID === props.focusedElement
          }
        >
          {props.feedback}
        </FeedbackField>
      </FramedContainer>
    </AnswerContainer>
  )
}

interface SCMCInputProps {
  isRadio: boolean
  isActive: boolean
  handleChange: (event: React.MouseEvent) => void
}
