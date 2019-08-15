import * as React from 'react'
import { styled } from '@edtr-io/ui'

const Container = styled.div<{ isRadio: boolean; checked: boolean }>(
  ({ isRadio, checked }) => {
    return {
      cursor: 'pointer',
      border: checked
        ? isRadio
          ? '5px solid #003399'
          : '2px solid #003399'
        : '2px solid lightgray',
      borderRadius: isRadio ? '50%' : '15%',
      width: '20px',
      height: '20px',
      display: 'inline-block',
      verticalAlign: 'middle',
      backgroundColor: checked && !isRadio ? '#003399' : 'white'
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

export class SCMCInput extends React.Component<SCMCInputProps> {
  public render() {
    const { isSingleChoice, isActive, handleChange } = this.props
    return (
      <Container
        isRadio={isSingleChoice}
        checked={isActive}
        onClick={e => {
          handleChange(e)
        }}
      >
        {isSingleChoice ? null : <Tick checked={isActive} />}
      </Container>
    )
  }
}

interface SCMCInputProps {
  isSingleChoice: boolean
  isActive: boolean
  handleChange: (event: React.MouseEvent) => void
}
