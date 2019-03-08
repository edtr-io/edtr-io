import * as React from 'react'
import onClickOutsideHOC from 'react-onclickoutside'

class Comp extends React.Component<{ onClick: (e: Event) => void }> {
  public handleClickOutside = this.props.onClick
  public render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

export const OnClickOutside = onClickOutsideHOC(Comp)
