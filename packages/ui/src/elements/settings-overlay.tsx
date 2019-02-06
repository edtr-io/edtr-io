import * as React from 'react'
import { Icon, faCog, styled } from '..'

const OverlayBox = styled.div({
  width: '100%',
  position: 'absolute',
  right: '0',
  zIndex: 1,
  backgroundColor: 'rgb(51,51,51,0.95)',
  paddingBottom: '10px'
})
const SettingButton = styled.button({
  float: 'right',
  position: 'relative',
  zIndex: 2,
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',
  paddingTop: '5px'
})

export class SettingOverlay extends React.Component<
  SettingOverlayProps,
  { showOverlay: boolean }
> {
  public constructor(props: SettingOverlayProps) {
    super(props)
    this.state = { showOverlay: false }
  }
  public render() {
    const { readOnly } = this.props
    return readOnly ? null : (
      <React.Fragment>
        <SettingButton
          onClick={() =>
            this.setState({ showOverlay: !this.state.showOverlay })
          }
        >
          <Icon fixedWidth icon={faCog} />
        </SettingButton>
        {this.state.showOverlay ? (
          <OverlayBox>{this.props.children}</OverlayBox>
        ) : null}
      </React.Fragment>
    )
  }
}

export interface SettingOverlayProps {
  readOnly: boolean
}
