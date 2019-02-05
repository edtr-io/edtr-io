import { styled } from '@edtr-io/ui'

export const ButtonGroup = styled.div({
  display: 'flex',
  width: '80%',
  margin: '20px auto 0',
  alignItems: 'center',
  justifyContent: 'center'
})

export const Button = styled.button<{ active?: boolean }>(({ active }) => {
  return {
    backgroundColor: active ? '#999999' : '#CCCCCC',
    cursor: 'pointer',
    color: active ? '#EEEEEE' : '#333333',
    outline: 'none',
    height: '30px',
    border: 'none',
    maxWidth: '40px',
    flex: 1,
    borderRight: '1px solid #999999',
    '&:first-child': {
      borderBottomLeftRadius: '5px',
      borderTopLeftRadius: '5px'
    },
    '&:last-child': {
      borderBottomRightRadius: '5px',
      borderTopRightRadius: '5px',
      border: 'none'
    },
    '&:hover': {
      backgroundColor: '#999999',
      color: '#CCCCCC'
    }
  }
})
