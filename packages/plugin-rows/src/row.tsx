import {
  StatefulPluginEditorProps,
  getDocument,
  EditorContext,
  ActionType,
  PluginState,
  getPlugins,
  Plugin
} from '@edtr-io/core'
import {
  styled,
  faTrashAlt,
  faCaretSquareUp,
  faCaretSquareDown,
  faCut,
  faCopy,
  Icon,
  faPlus,
  OnClickOutside,
  Button,
  OverlayBox
} from '@edtr-io/editor-ui'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import * as R from 'ramda'
import * as React from 'react'

import { Clipboard } from './clipboard'
import { rowsState } from '.'

export const FloatingButton = styled.button(
  ({ disabled }: { disabled?: boolean }) => ({
    outline: 'none',
    width: '30px',
    height: '1em',
    zIndex: 50,
    background: disabled ? 'none' : 'white',
    border: 'none',
    padding: 0,
    margin: '0 auto',
    borderRadius: 0,
    color: disabled ? 'transparent' : '#d9d9d9',
    '&:hover': disabled
      ? undefined
      : {
          cursor: 'pointer',
          color: 'black'
        },
    display: 'inline-block'
  })
)

const AddMenuContainer = styled(OverlayBox)({
  padding: '20px',
  maxWidth: '400px'
})

const AddMenu = styled.div({
  display: 'flex',
  flexFlow: 'row wrap',
  justifyContent: 'space-around'
})

export const FloatingButtonContainer = styled.div({
  position: 'absolute',
  height: '0',
  textAlign: 'center'
})

export const IconButton: React.FunctionComponent<{
  onClick: () => void
  icon: IconProp
  disabled?: boolean
}> = props => (
  <FloatingButton
    onMouseDown={props.disabled ? undefined : props.onClick}
    disabled={props.disabled}
  >
    <Icon icon={props.icon} size={'lg'} />
  </FloatingButton>
)

export const Add: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton {...props} icon={faPlus} />

export const TopFloatingButtonContainer = styled(FloatingButtonContainer)({
  top: '-12px',
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
  top: '-12px',
  right: 0,
  width: 'auto',
  textAlign: 'right'
})

const Remove: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faTrashAlt} {...props} />

const MoveUp: React.FunctionComponent<{
  onClick: () => void
  disabled?: boolean
}> = props => <IconButton icon={faCaretSquareUp} {...props} />

const MoveDown: React.FunctionComponent<{
  onClick: () => void
  disabled?: boolean
}> = props => <IconButton icon={faCaretSquareDown} {...props} />

const Cut: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faCut} {...props} />
const Copy: React.FunctionComponent<{
  onClick: () => void
}> = props => <IconButton icon={faCopy} {...props} />

export const RowContainer = styled.div({
  minHeight: '10px',
  position: 'relative',
  padding: '10px 0'
})

const HoverContainer = styled(RowContainer)({
  '&:hover': {
    border: '2px solid rgba(0,0,0,0.15)',
    margin: '-2px'
  }
})

const Popup: React.FunctionComponent<{
  onClickOutside: () => void
  onClose: (pluginState: PluginState) => void
  plugins: Record<string, Plugin>
  ownName?: string
}> = props => {
  return (
    <OnClickOutside onClick={props.onClickOutside}>
      <AddMenuContainer>
        <AddMenu>
          {R.map(plugin => {
            if (plugin === props.ownName) {
              return null
            }
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

export const Row = (
  props: StatefulPluginEditorProps<typeof rowsState> & {
    index: number
  }
) => {
  const [hover, setHover] = React.useState(false)
  const [popup, setPopup] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)
  const store = React.useContext(EditorContext)
  const rows = props.state
  const index = props.index
  const row = rows()[index]

  function onAdd(insertIndex: number) {
    setPopup({
      index: insertIndex,
      onClose: (pluginState: PluginState) => {
        rows.insert(insertIndex, pluginState)
        setPopup(undefined)
      }
    })
  }
  return (
    <HoverContainer
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && props.editable ? (
        <TopFloatingButtonContainer>
          <Add onClick={() => onAdd(index)} />
        </TopFloatingButtonContainer>
      ) : null}
      {popup && popup.index === index ? (
        <Popup
          onClickOutside={() => setPopup(undefined)}
          onClose={popup.onClose}
          plugins={getPlugins(store.state)}
          ownName={props.name}
        />
      ) : null}
      {row.render({
        insert: (options?: { plugin: string; state?: unknown }) =>
          rows.insert(index + 1, options),
        mergeWithPrevious: (merge: (statePrevious: unknown) => unknown) => {
          if (index - 1 < 0) return
          const previous = getDocument(store.state, rows()[index - 1].id)
          const current = getDocument(store.state, row.id)
          if (!previous || !current || previous.plugin !== current.plugin)
            return
          merge(previous.state)
          setTimeout(() => rows.remove(index - 1))
        },
        mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
          if (index + 1 === rows().length) return
          const next = getDocument(store.state, rows()[index + 1].id)
          const current = getDocument(store.state, row.id)
          if (!next || !current || next.plugin !== current.plugin) return
          merge(next.state)
          setTimeout(() => {
            rows.remove(index + 1)
          })
        }
      })}
      {props.editable && hover ? (
        <React.Fragment>
          <BottomFloatingButtonContainer>
            <Add onClick={() => onAdd(index + 1)} />
          </BottomFloatingButtonContainer>
          <RightFloatingButtonContainer>
            <MoveUp
              disabled={index <= 0}
              onClick={() => rows.move(index, index - 1)}
            />
            <MoveDown
              disabled={index + 1 >= rows.items.length}
              onClick={() => rows.move(index, index + 1)}
            />
            <Copy onClick={() => copyToClipboard(row())} />
            <Cut
              onClick={() => {
                copyToClipboard(row())
                rows.remove(index)
              }}
            />
            <Remove onClick={() => rows.remove(index)} />
          </RightFloatingButtonContainer>
        </React.Fragment>
      ) : null}
      {popup && popup.index === index + 1 ? (
        <Popup
          onClickOutside={() => setPopup(undefined)}
          onClose={popup.onClose}
          plugins={getPlugins(store.state)}
          ownName={props.name}
        />
      ) : null}
    </HoverContainer>
  )

  function copyToClipboard(id: string) {
    store.dispatch({
      type: ActionType.CopyToClipboard,
      payload: id
    })
  }
}
