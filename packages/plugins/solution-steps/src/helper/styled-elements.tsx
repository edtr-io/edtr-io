import { styled } from '@edtr-io/editor-ui'
import { explanation } from '../editor'

export const Buttoncontainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%'
})

export const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  position: 'relative'
})

export const Content = styled.div<{ type: string; isHalf: boolean }>(
  ({ type, isHalf }: { type: string; isHalf: boolean }) => {
    return {
      marginTop: '10px',
      boxShadow: ` 0 1px 3px 0 ${type !== explanation ? 'black' : 'blue'}`,
      padding: '3px',
      width: isHalf ? '50%' : '100%'
    }
  }
)
export const Controls = styled.div({
  right: '0',
  position: 'absolute',
  top: '0',
  transform: 'translate(50%, -5px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

export const ControlButton = styled.button({
  borderRadius: '50%',
  border: '1px solid rgba(5,51,51,0.95)',
  width: '25px',
  height: '25px',
  outline: 'none',
  textAlign: 'center',
  background: 'rgba(51,51,51,0.95)',
  color: 'white',
  zIndex: 20,
  '&:hover': {
    background: '#469bff',
    border: '1px solid #469bff'
  }
})

export const DragHandler = styled.div({
  borderRadius: '50%',
  width: '25px',
  height: '25px',
  outline: 'none',
  textAlign: 'center',
  background: 'rgba(51,51,51,0.95)',
  color: 'white',
  zIndex: 20,
  '&:hover': {
    background: '#469bff'
  }
})
