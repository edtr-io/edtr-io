import {
  EditorContext,
  PluginState,
  serializePlugin,
  StatefulPluginEditorProps
} from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'

import {
  Icon,
  faPlus,
  faTrashAlt,
  faCaretSquareUp,
  faCaretSquareDown,
  faCut,
  styled,
  rowsState,
  faCopy
} from '..'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Clipboard } from './clipboard'
import { OnClickOutside } from '../elements/onClickOutside'

const FloatingButton = styled.button({
  outline: 'none',
  width: '15px',
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
  },
  display: 'inline-block'
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
  width: 'auto',
  textAlign: 'right'
})

const AddMenuContainer = styled.div({
  margin: '0 auto',
  position: 'absolute',
  backgroundColor: 'rgb(51,51,51,0.95)',
  color: 'white',
  padding: '20px',
  width: '20%',
  left: '40%',
  zIndex: 100
})

const AddMenu = styled.div({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-around'
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
  <FloatingButton onClick={props.onClick}>
    <Icon icon={faTrashAlt} />
  </FloatingButton>
)

const IconButton: React.FunctionComponent<{
  onClick: () => void
  icon: IconProp
}> = props => (
  <FloatingButton onClick={props.onClick}>
    <Icon icon={props.icon} />
  </FloatingButton>
)

const MoveUp: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faCaretSquareUp} {...props} />

const MoveDown: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faCaretSquareDown} {...props} />

const EmptySpot: React.FunctionComponent = () => <FloatingButton />

const Cut: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faCut} {...props} />
const Copy: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faCopy} {...props} />

export const RowsPlugin = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  const [popup, setPopup] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
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
              <OnClickOutside onClick={() => setPopup(undefined)}>
                <AddMenuContainer>
                  <AddMenu>
                    {R.map(plugin => {
                      return (
                        <button
                          key={plugin}
                          onClick={() => {
                            popup.onClose({ plugin })
                          }}
                        >
                          {plugin}
                        </button>
                      )
                    }, R.keys(store.state.plugins))}
                  </AddMenu>
                  <hr />
                  <Clipboard
                    states={store.clipboard.get()}
                    onClose={popup.onClose}
                  />
                </AddMenuContainer>
              </OnClickOutside>
            ) : null}
            <Add
              onClick={() =>
                setPopup({
                  index,
                  onClose: (pluginState: PluginState) => {
                    rows.insert(index + 1, pluginState)
                    setPopup(undefined)
                  }
                })
              }
            />
            <RightFloatingButtonContainer>
              {index > 0 ? (
                <MoveUp onClick={() => rows.move(index, index - 1)} />
              ) : (
                <EmptySpot />
              )}
              {index + 1 < rows.items.length ? (
                <MoveDown onClick={() => rows.move(index, index + 1)} />
              ) : (
                <EmptySpot />
              )}
              <Copy onClick={() => serialize(row())} />
              <Cut
                onClick={() => {
                  serialize(row())
                  rows.remove(index)
                }}
              />
              <Remove onClick={() => rows.remove(index)} />
            </RightFloatingButtonContainer>
            {row.render()}
          </div>
        )
      })}
    </React.Fragment>
  )

  function serialize(id: string) {
    const serialized = serializePlugin(store.state, id)
    if (serialized) {
      store.clipboard.add(serialized)
    } else {
      // eslint-disable-next-line no-console
      console.error("Couldn't serialize plugin with id", id)
    }
  }
}
