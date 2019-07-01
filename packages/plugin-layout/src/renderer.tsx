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
  return {
    width: `${(width / 24) * 100}%`,
    '@media (max-width: 480px)': {
      width: '100%'
    }
  }
})
const ConvertInfo = styled.div({
  padding: '5px',
  backgroundColor: '#f2dede',
  color: '#a94442',
  border: '1px solid #ebccd1',
  textAlign: 'center'
})

const ConvertButton = styled.button({
  borderRadius: '5px',
  margin: '5px',
  border: 'none',
  outline: 'none',
  backgroundColor: 'white',
  '&:hover': { backgroundColor: '#ebccd1' }
})

export class LayoutRenderer extends React.Component<
  StatefulPluginEditorProps<typeof layoutState> & {
    insert?: (options?: { plugin: string; state?: unknown }) => void
  }
> {
  public render() {
    return (
      <React.Fragment>
        {this.props.editable ? (
          <ConvertInfo>
            Um die Inhalte zu verschieben, kovertiere sie für den neuen Editor:
            <div>
              <ConvertButton
              // TODO: fix after redux PR
              // onClick={() => {
              //   this.props.state.items.forEach(item => {
              //     if (this.props.insert) {
              //       this.props.insert(item.child())
              //     }
              //   })
              // }}
              >
                Konvertiere
              </ConvertButton>
            </div>
          </ConvertInfo>
        ) : null}
        <LayoutContainer>
          {this.props.state.items.map((item, index) => {
            return (
              <ChildContainer key={index} width={item.width()}>
                {item.child.render()}
              </ChildContainer>
            )
          })}
        </LayoutContainer>
      </React.Fragment>
    )
  }
}
