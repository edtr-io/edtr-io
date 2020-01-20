import * as React from 'react'
import onClickOutsideHOC from 'react-onclickoutside'

class Comp extends React.Component<OnClickOutsideProps> {
  public handleClickOutside = this.props.onClick
  public render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

/** @public */
export const OnClickOutside = (onClickOutsideHOC(
  Comp
) as unknown) as React.ComponentType<OnClickOutsideProps>

/** @public */
export interface OnClickOutsideProps {
  onClick(e: Event): void
}
