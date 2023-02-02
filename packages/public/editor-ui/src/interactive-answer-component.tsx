import { styled, Icon, faTimes, faPlus } from '@edtr-io/ui'
import * as React from 'react'

const AddButtonComponent = styled.button({
  margin: '5px 2% 5px 2%',
  width: '96%',
  borderRadius: '10px',
  backgroundColor: 'white',
  textAlign: 'left',
  color: 'lightgrey',
  minHeight: '50px',
  border: '2px solid lightgrey',
  outline: 'none',
  '&:hover': { border: '3px solid #007ec1', color: '#007ec1' },
})

/**
 * @param props - Props
 * @internal
 */
export function AddButton(props: AddButtonProps) {
  return (
    <AddButtonComponent title={props.title} onMouseDown={props.onClick}>
      <Icon icon={faPlus} /> {props.children}
    </AddButtonComponent>
  )
}
/** @internal */
export interface AddButtonProps {
  onClick: () => void
  children: string
  title?: string
}

const AnswerContainer = styled.div({
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
})

const CheckboxContainer = styled.div({
  width: '10%',
  textAlign: 'center',
  marginRight: '10px',
  fontWeight: 'bold',
})

const RemoveButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  background: 'white',
  zIndex: 20,
  float: 'right',
  transform: 'translate(50%, -40%)',
  '&:hover': {
    border: '3px solid #007ec1',
    color: '#007ec1',
  },
})

const FeedbackField = styled.div({
  paddingLeft: '20px',
  paddingBottom: '10px',
  paddingTop: '10px',
  marginTop: '5px',
})

const FramedContainer = styled.div<{ focused: boolean }>(({ focused }) => {
  const defaultBorders = {
    border: '2px solid lightgrey',
    [`${RemoveButton}`]: {
      border: '2px solid lightgrey',
      color: 'lightgrey',
    },
    [`${FeedbackField}`]: {
      borderTop: '2px solid lightgrey',
    },
  }
  const focusedBorders = {
    border: '3px solid #007ec1',
    [`${RemoveButton}`]: {
      border: '3px solid #007ec1',
      color: '#007ec1',
    },
    [`${FeedbackField}`]: {
      borderTop: '2px solid #007ec1',
    },
  }

  return {
    width: '100%',
    marginLeft: '10px',
    borderRadius: '10px',

    ...(focused ? focusedBorders : defaultBorders),
    '&:focus-within': focusedBorders,
  }
})
const AnswerField = styled.div({ paddingLeft: '20px', paddingTop: '10px' })

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
      backgroundColor: checked && !isRadio ? '#007ec1' : 'white',
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
    transform: 'rotate(-45deg)',
  }
})

/** @internal */
export class CheckElement extends React.Component<CheckElementProps> {
  public render() {
    const { isRadio, isActive, handleChange } = this.props
    return (
      <Container
        isRadio={isRadio}
        checked={isActive}
        onClick={(e) => {
          handleChange(e)
        }}
      >
        {isRadio ? null : <Tick checked={isActive} />}
      </Container>
    )
  }
}

const BlockLabel = styled.label({
  display: 'block',
})

/**
 * @param props - Props
 * @internal
 */
export function InteractiveAnswer(props: InteractiveAnswerProps) {
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
      <FramedContainer
        focused={
          props.answerID === props.focusedElement ||
          props.feedbackID === props.focusedElement
        }
      >
        <AnswerField>
          <>
            <BlockLabel>{props.i18n.answer.label}:</BlockLabel>
            {props.answer}
          </>
        </AnswerField>
        <RemoveButton onClick={props.remove}>
          <Icon icon={faTimes} />
        </RemoveButton>
        <FeedbackField>
          <BlockLabel>{props.i18n.feedback.label}:</BlockLabel>
          {props.feedback}
        </FeedbackField>
      </FramedContainer>
    </AnswerContainer>
  )
}

/** @internal */
export interface InteractiveAnswerProps {
  isRadio?: boolean
  isActive?: boolean
  handleChange: () => void
  answerID?: string
  feedbackID: string
  answer: HTMLInputElement | React.ReactNode
  feedback: React.ReactNode
  focusedElement?: string
  remove: () => void
  i18n: {
    answer: { label: string }
    feedback: { label: string }
  }
}

/** @internal */
export interface CheckElementProps {
  isRadio: boolean
  isActive: boolean
  handleChange: (event: React.MouseEvent) => void
}
