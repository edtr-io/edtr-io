import { styled } from '../theme'
import * as React from 'react'

const NoClickArea = styled.div<{ active: boolean }>(props => {
  return {
    pointerEvents: props.active ? 'unset' : 'none',
    position: 'relative'
  }
})
const Overlay = styled.div<{ active: boolean }>(props => {
  return {
    display: props.active ? 'none' : undefined,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
})
const ActivateButton = styled.button({
  pointerEvents: 'all',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  width: '100px',
  textAlign: 'center',
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: 'calc(50% - 50px)',
  backgroundColor: 'rgb(0,126,193)',
  zIndex: 10
})
export const PreviewOverlay: React.FunctionComponent<
  PreviewOverlayProps
> = props => {
  const [active, setActive] = React.useState(false)
  React.useEffect(() => {
    if (!props.focused && active) {
      setActive(false)
    }
  }, [props.focused, active])
  return (
    <NoClickArea active={active}>
      <Overlay active={active}>
        <ActivateButton
          onClick={() => {
            setActive(true)
          }}
        >
          Aktivieren
        </ActivateButton>
      </Overlay>
      {props.children}
    </NoClickArea>
  )
}

interface PreviewOverlayProps {
  focused: boolean
}
