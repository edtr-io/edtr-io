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

const ChildContainer = styled.div<{ width: number }>(({ width }) => {
  return { width: `${(width / 24) * 100}%` }
})

export class LayoutRenderer extends React.Component<
  StatefulPluginEditorProps<typeof layoutState>
> {
  public render() {
    return (
      <LayoutContainer>
        {this.props.state.items.map((item, index) => {
          return (
            <ChildContainer key={index} width={item.width()}>
              {item.child.render()}
            </ChildContainer>
          )
        })}
      </LayoutContainer>
    )
  }
}
