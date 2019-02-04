import {
  createDocumentIdentifier,
  Document,
  DocumentIdentifier,
  PluginEditorProps
} from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'

import { Icon, faPlus, faTrashAlt, styled } from '..'

const FloatingButton = styled.button({
  outline: 'none',
  width: '100%',
  height: '1em',
  background: 'none',
  border: 'none',
  padding: 0,
  margin: '0 auto',
  borderRadius: 0,
  opacity: 0.15,
  '&:hover': {
    cursor: 'pointer',
    opacity: 1
  }
})

const FloatingButtonContainer = styled.div({
  position: 'absolute',
  height: '0',
  textAlign: 'center'
})

const TopFloatingButtonContainer = styled(FloatingButtonContainer)({
  top: '0',
  width: '20px',
  left: '50%'
})

const BottomFloatingButtonContainer = styled(FloatingButtonContainer)({
  bottom: '10px',
  width: '20px',
  left: '50%'
})

const RightFloatingButtonContainer = styled(FloatingButtonContainer)({
  // top: '-10px',
  top: 0,
  right: 0,
  width: '20px'
})

const Add: React.FunctionComponent<{
  onClick: () => void
}> = props => (
  <BottomFloatingButtonContainer>
    <FloatingButton onClick={props.onClick}>
      <Icon icon={faPlus} />
    </FloatingButton>
  </BottomFloatingButtonContainer>
)

const Remove: React.FunctionComponent<{
  onClick: () => void
}> = props => (
  <RightFloatingButtonContainer>
    <FloatingButton onClick={props.onClick}>
      <Icon icon={faTrashAlt} />
    </FloatingButton>
  </RightFloatingButtonContainer>
)

export const RowsPlugin = (props: PluginEditorProps<RowsState>) => {
  const { rows } = props.state

  return (
    <React.Fragment>
      <TopFloatingButtonContainer>
        <FloatingButton onClick={() => addPlugin(0)}>
          <Icon icon={faPlus} />
        </FloatingButton>
      </TopFloatingButtonContainer>
      {rows.map((row, index) => {
        return (
          <Document
            key={index}
            state={row}
            render={children => {
              return (
                <div style={{ position: 'relative' }}>
                  <Add onClick={() => addPlugin(index + 1)} />
                  <Remove onClick={() => removePlugin(index)} />
                  {children}
                </div>
              )
            }}
          />
        )
      })}
    </React.Fragment>
  )

  function addPlugin(index: number) {
    props.onChange({
      rows: R.insert(index, createDocumentIdentifier(), props.state.rows)
    })
  }

  function removePlugin(index: number) {
    props.onChange({
      rows: R.remove(index, 1, props.state.rows)
    })
  }
}

export interface RowsState {
  rows: DocumentIdentifier[]
}
