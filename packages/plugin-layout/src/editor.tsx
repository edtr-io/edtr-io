import * as React from 'react'
import {
  StatefulPluginEditorProps,
  selectors,
  useStore,
  DocumentState
} from '@edtr-io/core'
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

export const LayoutRenderer: React.FunctionComponent<
  StatefulPluginEditorProps<typeof layoutState> & {
    insert?: (options?: DocumentState) => void
    remove?: () => void
  }
> = props => {
  const store = useStore()
  const convertToRow = () => {
    props.state.items.reverse().forEach(item => {
      if (props.insert) {
        const element = selectors.serializeDocument(
          store.getState(),
          item.child.id
        )
        if (element) {
          if (element.plugin === 'rows') {
            const rowsState = element.state as DocumentState[]
            rowsState.reverse().forEach(rowsItem => {
              if (props.insert) {
                props.insert(rowsItem)
              }
            })
          } else {
            props.insert(element)
          }
        }
      }
    })
    if (props.remove) {
      props.remove()
    }
  }
  return (
    <React.Fragment>
      {props.editable ? (
        <ConvertInfo>
          Um die Inhalte zu verschieben, konvertiere sie für den neuen Editor:
          <div>
            <ConvertButton onClick={convertToRow}>Konvertiere</ConvertButton>
          </div>
        </ConvertInfo>
      ) : null}
      <LayoutContainer>
        {props.state.items.map((item, index) => {
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
