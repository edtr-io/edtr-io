import * as React from 'react'
import * as R from 'ramda'
import {
  createDocumentIdentifier,
  Document,
  DocumentIdentifier,
  PluginEditorProps
} from '@edtr-io/core'
import { styled, Icon, faPlus } from '..'

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

const Add = (props: { onClick: () => void }) => (
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
          <div>
            <Add onClick={() => addPlugin(index)} />
            <Document state={row} />
          </div>
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
