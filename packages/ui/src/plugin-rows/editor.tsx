import { Document, StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { Icon, faPlus, faTrashAlt, styled, rowsState } from '..'

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
  left: '50%',
  zIndex: 90
})

const RightFloatingButtonContainer = styled(FloatingButtonContainer)({
  top: '-10px',
  right: 0,
  width: '20px'
})

const Add: React.FunctionComponent<{
  onClick: () => void
}> = props => (
  <BottomFloatingButtonContainer>
    <FloatingButton onMouseDown={props.onClick}>
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

export const RowsPlugin = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  return (
    <React.Fragment>
      <TopFloatingButtonContainer>
        <FloatingButton
          onMouseDown={() => {
            rows.insert(0)
          }}
        >
          <Icon icon={faPlus} />
        </FloatingButton>
      </TopFloatingButtonContainer>
      {rows.items.map((row, index) => {
        return (
          <Document
            key={row.value.id}
            state={row.$$value}
            render={children => {
              return (
                <div style={{ position: 'relative' }}>
                  <Add onClick={() => rows.insert(index + 1)} />
                  <Remove onClick={() => rows.remove(index)} />
                  {children}
                </div>
              )
            }}
          />
        )
      })}
    </React.Fragment>
  )
}
