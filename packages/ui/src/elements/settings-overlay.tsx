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

let overlayNode = React.createRef<HTMLDivElement>()

export const renderIntoOverlay = (children: React.ReactNode) => {
  if (!overlayNode.current) {
    // console.log('overlay node not defined')
    return null
  }
  // console.log(overlayNode)

  return createPortal(children, overlayNode.current)
}

export const OverlayContext = React.createContext<{
  showOverlay: () => void
  hideOverlay: () => void
}>({
  showOverlay: () => {},
  hideOverlay: () => {}
})

export const SettingOverlay: React.FunctionComponent = () => {
  return (
    <OverlayContext.Consumer>
      {({ hideOverlay }) => {
        return (
          <OverlayWrapper>
            <OverlayBox onBlur={hideOverlay}>
              <SettingButton
                onClick={hideOverlay}
                light
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                <Icon icon={faTimes} />
              </SettingButton>
              <div ref={overlayNode} />
            </OverlayBox>
          </OverlayWrapper>
        )
      }}
    </OverlayContext.Consumer>
  )
}

export const OverlayButton: React.FunctionComponent<
  OverlayButtonProps
> = props => {
  return (
    <OverlayContext.Consumer>
      {({ showOverlay }) => {
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
      }}
    </OverlayContext.Consumer>
  )
}

export interface OverlayButtonProps {
  positionAtElement?: boolean
}
