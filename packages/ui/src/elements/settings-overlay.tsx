import * as React from 'react'
import { Icon, faCog, styled, faTimes } from '..'

const OverlayBox = styled.div({
  width: '80%',
  position: 'absolute',
  zIndex: 100,
  backgroundColor: 'rgb(51,51,51,0.95)',
  paddingBottom: '10px',
  left: '10%'
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

export class SettingOverlay extends React.Component<
  SettingOverlayProps,
  { showOverlay: boolean }
> {
  public constructor(props: SettingOverlayProps) {
    super(props)
    this.state = { showOverlay: false }
  }

  public showOverlay() {
    this.setState({
      showOverlay: true
    })
  }
  public render() {
    const { readOnly } = this.props
    return readOnly ? null : (
      <React.Fragment>
        {this.state.showOverlay ? (
          <OverlayBox
            onBlur={e => {
              // console.log('Settings onBlur', e)
              // this.setState({
              //   showOverlay: false
              // })
            }}
          >
            <SettingButton
              onClick={() => this.setState({ showOverlay: false })}
              light
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              <Icon icon={faTimes} />
            </SettingButton>
            {this.props.children}
          </OverlayBox>
        ) : (
          <SettingButton
            onClick={() =>
              this.setState({ showOverlay: !this.state.showOverlay })
            }
            style={this.props.buttonStyle}
          >
            <Icon fixedWidth icon={faCog} />
          </SettingButton>
        )}
      </React.Fragment>
    )
  }
}

export interface SettingOverlayProps {
  readOnly: boolean
  buttonStyle?: any
}
