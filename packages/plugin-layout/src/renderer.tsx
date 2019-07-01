import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core/src'
import { layoutState } from '.'
import { styled } from '@edtr-io/renderer-ui'

const LayoutContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start'
})

const ChildContainer = styled.div<{ width: string }>(({ width }) => {
  return { width: width }
})

export class LayoutRenderer extends React.Component<
  StatefulPluginEditorProps<typeof layoutState>
> {
  public render() {
    return (
      <LayoutContainer>
        {this.props.state.items.map((child, index) => {
          return (
            <ChildContainer width={child.width()}>
              {child.child.render()}
            </ChildContainer>
          )
        })}
      </LayoutContainer>
    )
  }
}
