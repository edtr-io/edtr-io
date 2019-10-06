/**
 * @module @edtr-io/editor-ui
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as React from 'react'
import onClickOutsideHOC from 'react-onclickoutside'

class Comp extends React.Component<{ onClick: (e: Event) => void }> {
  public handleClickOutside = this.props.onClick
  public render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

export const OnClickOutside: typeof Comp = (onClickOutsideHOC(
  Comp
) as unknown) as typeof Comp
