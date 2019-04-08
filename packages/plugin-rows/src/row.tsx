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
  faEllipsisV,
  OnClickOutside,
  Button,
  OverlayBox
} from '@edtr-io/ui'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import * as R from 'ramda'
import * as React from 'react'

import { Clipboard } from './clipboard'
import { rowsState } from '.'

export const FloatingButton = styled.button(
  ({ disabled }: { disabled?: boolean }) => ({
    outline: 'none',
    width: '23px',
    alignContent: 'center',
    // height: '1em',
    zIndex: 150,
    background: disabled ? 'none' : 'white',
    border: 'none',
    padding: '0px 2px',
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
  minHeight: '100%',
  top: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  padding: '0 20px',
  right: -50,
  width: 'auto',
  textAlign: 'right',
  minWidth: '25px',

  zIndex: 100
})
const FurtherSettingsToolbar = styled(FloatingButtonContainer)({
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  backgroundColor: 'green',
  border: '2px solid white',
  width: 'auto',
  height: 'auto'
})
const HoverContainer = styled(RightFloatingButtonContainer)({})

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

const FurtherSettings: React.FunctionComponent<{
  onClick: () => void
  disabled?: boolean
}> = props => <IconButton icon={faEllipsisV} {...props} />

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
  const [hoverRight, setHoverRight] = React.useState(false)
  const [popup, setPopup] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)
  const [furtherSettings, showFurtherSettings] = React.useState(false)
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
    <RowContainer>
      {props.editable ? (
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
      {props.editable ? (
        <React.Fragment>
          <BottomFloatingButtonContainer>
            <Add onClick={() => onAdd(index + 1)} />
          </BottomFloatingButtonContainer>
          <HoverContainer
            onMouseEnter={() => setHoverRight(true)}
            onMouseLeave={() => {
              setHoverRight(false)
              showFurtherSettings(false)
            }}
          >
            {hoverRight ? (
              <React.Fragment>
                {index <= 0 ? null : (
                  <MoveUp onClick={() => rows.move(index, index - 1)} />
                )}
                {index + 1 >= rows.items.length ? null : (
                  <MoveDown onClick={() => rows.move(index, index + 1)} />
                )}
                <FurtherSettingsToolbar>
                  {furtherSettings ? (
                    <React.Fragment>
                      <Copy onClick={() => copyToClipboard(row())} />
                      <Cut
                        onClick={() => {
                          copyToClipboard(row())
                          rows.remove(index)
                        }}
                      />
                      <Remove onClick={() => rows.remove(index)} />
                    </React.Fragment>
                  ) : null}
                  <FurtherSettings
                    onClick={() => {
                      showFurtherSettings(!furtherSettings)
                    }}
                  />
                </FurtherSettingsToolbar>
              </React.Fragment>
            ) : null}
          </HoverContainer>
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
    </RowContainer>
  )

  function copyToClipboard(id: string) {
    store.dispatch({
      type: ActionType.CopyToClipboard,
      payload: id
    })
  }
}
