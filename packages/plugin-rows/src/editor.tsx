import {
  ActionType,
  EditorContext,
  Plugin,
  PluginState,
  StatefulPluginEditorProps,
  getPlugins
} from '@edtr-io/core'
import {
  Icon,
  faPlus,
  faTrashAlt,
  faCaretSquareUp,
  faCaretSquareDown,
  faCut,
  styled,
  faCopy,
  OnClickOutside,
  defaultTheming,
  EditorTheming,
  Button
} from '@edtr-io/ui'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import * as R from 'ramda'
import * as React from 'react'

import { Clipboard } from './clipboard'
import { rowsState } from '.'
import { Row } from './renderer'
import { ThemeProps } from 'styled-components'

const FloatingButton = styled.button({
  outline: 'none',
  width: '20px',
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
  top: '-10px',
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

const AddMenuContainer = styled.div((props: ThemeProps<EditorTheming>) => {
  return {
    margin: '0 auto',
    position: 'absolute',
    backgroundColor: props.theme.backgroundColor,
    color: props.theme.textColor,
    padding: '20px',
    left: '8%',
    right: '8%',
    maxWidth: '400px',
    zIndex: 100
  }
})
AddMenuContainer.defaultProps = {
  theme: defaultTheming
}

const AddMenu = styled.div({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-around'
})

const RowsContainer = styled.div({ position: 'relative' })

const IconButton: React.FunctionComponent<{
  onClick: () => void
  icon: IconProp
}> = props => (
  <FloatingButton onMouseDown={props.onClick}>
    <Icon icon={props.icon} size={'lg'} />
  </FloatingButton>
)

const Add: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton {...props} icon={faPlus} />

const Remove: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faTrashAlt} {...props} />

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

const Popup: React.FunctionComponent<{
  onClickOutside: () => void
  onClose: (pluginState: PluginState) => void
  plugins: Record<string, Plugin>
}> = props => {
  return (
    <OnClickOutside onClick={props.onClickOutside}>
      <AddMenuContainer>
        <AddMenu>
          {R.map(plugin => {
            return (
              <Button
                key={plugin}
                onClick={() => {
                  props.onClose({ plugin })
                }}
              >
                {plugin}
              </Button>
            )
          }, R.keys(props.plugins))}
        </AddMenu>
        <hr />
        <Clipboard onClose={props.onClose} />
      </AddMenuContainer>
    </OnClickOutside>
  )
}

export const RowsEditor = (
  props: StatefulPluginEditorProps<typeof rowsState>
) => {
  const rows = props.state
  const [popup, setPopup] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)
  const store = React.useContext(EditorContext)

  function onAdd(insertIndex: number) {
    return function() {
      setPopup({
        index: insertIndex,
        onClose: (pluginState: PluginState) => {
          rows.insert(insertIndex, pluginState)
          setPopup(undefined)
        }
      })
    }
  }

  return (
    <RowsContainer>
      <TopFloatingButtonContainer>
        <Add onClick={onAdd(0)} />
      </TopFloatingButtonContainer>
      {popup && popup.index === 0 ? (
        <Popup
          onClickOutside={() => setPopup(undefined)}
          onClose={popup.onClose}
          plugins={getPlugins(store.state)}
        />
      ) : null}
      {rows.items.map((row, index) => {
        return (
          <div key={row.id} style={{ position: 'relative' }}>
            <Row>
              {row.render({
                focusPrevious: () => {
                  store.dispatch({ type: ActionType.FocusPrevious })
                },
                focusNext: () => {
                  store.dispatch({ type: ActionType.FocusNext })
                },
                insert: (options?: { plugin: string; state?: unknown }) =>
                  rows.insert(index + 1, options)
              })}
            </Row>
            {popup && popup.index === index + 1 ? (
              <Popup
                onClickOutside={() => setPopup(undefined)}
                onClose={popup.onClose}
                plugins={getPlugins(store.state)}
              />
            ) : null}
            <BottomFloatingButtonContainer>
              <Add onClick={onAdd(index + 1)} />
            </BottomFloatingButtonContainer>
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
              <Copy onClick={() => copyToClipboard(row())} />
              <Cut
                onClick={() => {
                  copyToClipboard(row())
                  rows.remove(index)
                }}
              />
              <Remove onClick={() => rows.remove(index)} />
            </RightFloatingButtonContainer>
          </div>
        )
      })}
    </RowsContainer>
  )

  function copyToClipboard(id: string) {
    store.dispatch({
      type: ActionType.CopyToClipboard,
      payload: id
    })
  }
}
