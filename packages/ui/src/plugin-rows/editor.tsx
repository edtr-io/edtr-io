import { EditorContext, StatefulPluginEditorProps } from '@edtr-io/core'
import * as R from 'ramda'
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

const AddMenuContainer = styled.div({
  margin: '0 auto',
  position: 'absolute',
  backgroundColor: 'rgb(51,51,51,0.95)',
  display: 'flex',
  padding: '20px',
  width: '20%',
  left: '40%',
  flexFlow: 'row wrap',
  justifyContent: 'space-around',
  zIndex: 100
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
  const [popup, setPopup] = React.useState<
    { index: number; onClose: (plugin: string) => void } | undefined
  >(undefined)
  const store = React.useContext(EditorContext)
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
          <div key={row.id} style={{ position: 'relative' }}>
            {popup && popup.index === index ? (
              <AddMenuContainer>
                {R.map(plugin => {
                  return (
                    <button
                      key={plugin}
                      onClick={() => {
                        popup.onClose(plugin)
                      }}
                    >
                      {plugin}
                    </button>
                  )
                }, R.keys(store.state.plugins))}
              </AddMenuContainer>
            ) : null}
            <Add
              onClick={() =>
                setPopup({
                  index,
                  onClose: (plugin: string) => {
                    rows.insert(index + 1, {
                      plugin: plugin
                    })
                    setPopup(undefined)
                  }
                })
              }
            />
            <Remove onClick={() => rows.remove(index)} />
            {row.render()}
          </div>
        )
      })}
    </React.Fragment>
  )
}
