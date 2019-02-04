import {
  createDocumentIdentifier,
  Document,
  DocumentIdentifier,
  PluginEditorProps
} from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'

import { Icon, faPlus, styled } from '..'

const AddButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  width: '35px',
  height: '35px',
  border: 'none',
  margin: 'auto',
  hover: {
    backgroundColor: '#333333'
  }
})

const AddButtonContainer = styled.div({
  textAlign: 'center'
})

const Add: React.FunctionComponent<{
  onClick: () => void
}> = props => (
  <AddButtonContainer>
    <AddButton onClick={props.onClick}>
      <Icon icon={faPlus} />
    </AddButton>
  </AddButtonContainer>
)

export const RowsPlugin = (props: PluginEditorProps<RowsState>) => {
  const { rows } = props.state

  return (
    <div>
      {rows.map((row, index) => {
        return (
          <Document
            key={index}
            state={row}
            render={children => {
              return (
                <React.Fragment>
                  <Add onClick={() => addPlugin(index)} />
                  {children}
                </React.Fragment>
              )
            }}
          />
        )
      })}
      <Add onClick={() => addPlugin(rows.length)} />
    </div>
  )

  function addPlugin(index: number) {
    props.onChange({
      rows: R.insert(index, createDocumentIdentifier(), props.state.rows)
    })
  }
}

export interface RowsState {
  rows: DocumentIdentifier[]
}
