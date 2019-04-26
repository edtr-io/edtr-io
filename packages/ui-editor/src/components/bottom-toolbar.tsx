import { styled } from '../theme'

// Toolbar at the bottom of the browser.
// TODO: Needs theming support
export const BottomToolbar = styled.div({
  position: 'fixed',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  opacity: 0.7,
  bottom: '0',
  backgroundColor: 'black',
  color: 'white',
  padding: '5px',
  zIndex: 90,
  borderRadius: '3px'
})
