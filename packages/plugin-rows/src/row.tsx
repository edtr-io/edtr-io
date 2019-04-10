import {
  StatefulPluginEditorProps,
  getDocument,
  PluginState,
  getPlugins,
  Plugin,
  copyToClipboard
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
  EditorTheming,
  defaultTheming
} from '@edtr-io/ui'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import * as R from 'ramda'
import * as React from 'react'
import { ThemeProps } from 'styled-components'

import { Clipboard } from './clipboard'
import { rowsState } from '.'
import { CopyAction, State } from '@edtr-io/core/src/store'
import { connect } from 'react-redux'

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

const RowConnector = (
  props: StatefulPluginEditorProps<typeof rowsState> & {
    index: number
  } & RowProps &
    RowDispatchProps
) => {
  const [hover, setHover] = React.useState(false)
  const [popup, setPopup] = React.useState<
    { index: number; onClose: (pluginState: PluginState) => void } | undefined
  >(undefined)

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
          plugins={props.plugins}
          ownName={props.name}
        />
      ) : null}
      {row.render({
        insert: (options?: { plugin: string; state?: unknown }) =>
          rows.insert(index + 1, options),
        mergeWithPrevious: (merge: (statePrevious: unknown) => unknown) => {
          if (index - 1 < 0) return
          const previous = props.getDocument(rows()[index - 1].id)
          const current = props.getDocument(row.id)
          if (!previous || !current || previous.plugin !== current.plugin)
            return
          merge(previous.state)
          setTimeout(() => rows.remove(index - 1))
        },
        mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
          if (index + 1 === rows().length) return
          const next = props.getDocument(rows()[index + 1].id)
          const current = props.getDocument(row.id)
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
            <Copy onClick={() => props.copyToClipboard(row())} />
            <Cut
              onClick={() => {
                props.copyToClipboard(row())
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
          plugins={props.plugins}
          ownName={props.name}
        />
      ) : null}
    </HoverContainer>
  )
}

const mapStateToProps = (state: State): RowProps => ({
  plugins: getPlugins(state),
  getDocument: (id: string) => getDocument(state, id)
})

const mapDispatchToProps: RowDispatchProps = {
  copyToClipboard
}

export const Row = connect(
  mapStateToProps,
  mapDispatchToProps
)(RowConnector)

export interface RowProps {
  plugins: Record<string, Plugin>
  getDocument: (id: string) => PluginState | null
}

export interface RowDispatchProps {
  copyToClipboard: (payload: string) => CopyAction
}
