import { styled } from '@edtr-io/ui'

export const ButtonGroup = styled.div({
  display: 'flex',
  width: '100%',
  margin: '20px 0 0'
  // position: 'absolute',
  // opacity: 0.25
  //
  // zIndex: 1,
  // left: -100000,
  // top: -100000,
  // padding: '8px 7px 6px',
  // position: 'absolute',
  // marginTop: '-6px',
  // opacity: 0,
  // borderRadius: 4,
  // transition: 'opacity 0.75s'
})

export const Button = styled.button<{ active?: boolean }>(({ active }) => {
  return {
    backgroundColor: '#222',
    cursor: 'pointer',
    color: active ? 'white' : '#AAA',
    outline: 'none',
    height: '25px',
    border: 'none',
    maxWidth: '40px',
    flex: 1,
    borderRight: '1px solid #999999',
    '&:first-child': {
      borderBottomLeftRadius: '8px',
      borderTopLeftRadius: '8px'
    },
    '&:last-child': {
      borderBottomRightRadius: '8px',
      borderTopRightRadius: '8px',
      border: 'none'
    },
    '&:hover': {
      // backgroundColor: '#999999',
      color: 'white'
      // borderBottom: '4px solid #AAA'
    }
  }
})
