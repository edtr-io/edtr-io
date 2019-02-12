import * as React from 'react'
import { createPortal } from 'react-dom'
import { Icon, faCog, styled, faTimes } from '..'

const OverlayWrapper = styled.div({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: '#00000033',
  zIndex: 99
})
const OverlayBox = styled.div({
  width: '80%',
  height: '80%',
  position: 'absolute',
  zIndex: 100,
  backgroundColor: 'rgb(51,51,51,0.95)',
  paddingBottom: '10px',
  left: '10%',
  top: '10%'
})

const SettingButton = styled.button<{ light?: boolean }>(({ light }) => ({
  float: 'right',
  position: 'relative',
  color: light ? '#aaaaaa' : '#999999',
  fontSize: 16,
  zIndex: 101,
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',
  paddingTop: '5px',
  '&:hover': {
    color: light ? '#eeeeee' : 'rgb(51,51,51)'
  }
}))

let overlayNode = React.createRef<SettingsOverlay>()
let portalNode = React.createRef<HTMLDivElement>()

export const Overlay: React.FunctionComponent = () => {
  return <SettingsOverlay ref={overlayNode} />
}
class SettingsOverlay extends React.Component<{}, { shown: boolean }> {
  public state = {
    shown: false
  }

  public show() {
    this.setState({
      shown: true
    })
  }
  public hide() {
    this.setState({
      shown: false
    })
  }

  public isShown() {
    return this.state.shown
  }

  public render() {
    return (
      <div
        ref={portalNode}
        style={this.isShown() ? undefined : { display: 'none' }}
      />
    )
  }
}
export const showOverlay = () => {
  if (!overlayNode.current) {
    return
  }

  overlayNode.current.show()
}

export const hideOverlay = () => {
  if (!overlayNode.current) {
    return
  }

  overlayNode.current.hide()
}

export const renderIntoOverlay = (children: React.ReactNode) => {
  if (!overlayNode.current || !portalNode.current) {
    return null
  }

  return createPortal(
    <OverlayWrapper>
      <OverlayBox>
        <SettingButton
          onClick={hideOverlay}
          light
          style={{ position: 'absolute', top: '10px', right: '10px' }}
        >
          <Icon icon={faTimes} />
        </SettingButton>
        {children}
      </OverlayBox>
    </OverlayWrapper>,
    portalNode.current
  )
}

export const OverlayButton: React.FunctionComponent<
  OverlayButtonProps
> = props => {
  return (
    <SettingButton
      onClick={showOverlay}
      style={
        props.positionAtElement
          ? {
              position: 'absolute',
              top: '10px',
              marginLeft: '-10px'
            }
          : undefined
      }
    >
      <Icon icon={faCog} />
    </SettingButton>
  )
}

export interface OverlayButtonProps {
  positionAtElement?: boolean
}
