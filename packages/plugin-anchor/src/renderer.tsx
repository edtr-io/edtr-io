import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { anchorState } from '.'
import { StatefulPluginEditorProps } from '@edtr-io/core'
const Anchor = styled.div({
  visibility: 'hidden'
})

export class AnchorRenderer extends React.Component<
  StatefulPluginEditorProps<typeof anchorState>
> {
  render() {
    return <Anchor id={this.props.state.value} />
  }
}
