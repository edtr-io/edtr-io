import React, { useState, useEffect } from 'react'
import {
  styled,
  faSortUp,
  faSortDown,
  faEllipsisH,
  faCopy,
  faCut,
  faTrashAlt
} from '@edtr-io/editor-ui'
import { rowsState, rowState, createRowPluginTheme } from '..'
import { StateType } from '@edtr-io/core'
import { Icon } from '@edtr-io/renderer-ui'
import { ThemeProps } from '@edtr-io/ui'

const StyledControls = styled.div(
  ({ index, name, ...props }: ThemeProps & { index: number; name: string }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      position: 'absolute',
      top: 0,
      right: 0,
      transform: 'translateX(calc(100% + 3px))',
      backgroundColor: theme.backgroundColor,
      color: theme.color,
      width: '25px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '0 3px 3px 0',
      opacity: 0,
      zIndex: 100 - index,
      transition: '250ms all ease-in-out'
    }
  }
)

const IconContainer = styled.div<{ disabled?: boolean; name: string }>(
  ({ disabled, name, ...props }) => {
    const theme = createRowPluginTheme(name, props.theme)
    return {
      height: '20px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.2 : 0.8,
      color: theme.color,
      '&:hover': {
        opacity: disabled ? 0.2 : 1,
        color: disabled ? theme.color : theme.highlightColor
      }
    }
  }
)

const MoveUp: IconInterface = ({ rows, index, name }) => (
  <IconContainer
    name={name}
    disabled={index === 0}
    onClick={() => {
      if (index === 0) return
      rows.move(index, index - 1)
    }}
  >
    <Icon icon={faSortUp} />
  </IconContainer>
)

const MoveDown: IconInterface = ({ rows, index, name }) => (
  <IconContainer
    name={name}
    disabled={index + 1 >= rows.items.length}
    onClick={() => {
      index + 1 < rows.items.length && rows.move(index, index + 1)
    }}
  >
    <Icon icon={faSortDown} />
  </IconContainer>
)

const More: IconInterface = ({ open, setOpen, name }) => {
  return (
    <IconContainer name={name} onClick={() => setOpen(!open)}>
      <Icon icon={faEllipsisH} />
    </IconContainer>
  )
}

const Copy: IconInterface = ({ row, copyToClipboard, name }) => {
  return (
    <IconContainer
      name={name}
      style={{ marginTop: 5, marginBottom: 5, marginRight: -1 }}
      onClick={() => copyToClipboard(row())}
    >
      <Icon icon={faCopy} />
    </IconContainer>
  )
}

const Cut: IconInterface = ({ rows, row, index, copyToClipboard, name }) => {
  return (
    <IconContainer
      name={name}
      disabled={rows.items.length === 1}
      style={{ marginBottom: 5 }}
      onClick={() => {
        if (rows.items.length === 1) return
        copyToClipboard(row())
        rows.remove(index)
      }}
    >
      <Icon icon={faCut} />
    </IconContainer>
  )
}

const Remove: IconInterface = ({ rows, index, name }) => {
  return (
    <IconContainer
      name={name}
      disabled={rows.items.length === 1}
      style={{ marginBottom: 3 }}
      onClick={() => {
        if (rows.items.length === 1) return
        rows.remove(index)
      }}
    >
      <Icon icon={faTrashAlt} />
    </IconContainer>
  )
}

type IconInterface = React.FunctionComponent<IconProps>
interface IconProps {
  key: number
  name: string
  index: number
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  open: boolean
  setOpen: (newValue: boolean) => void
  copyToClipboard: (
    row: StateType.StateDescriptorValueType<typeof rowState>
  ) => void
  row: StateType.StateDescriptorReturnType<typeof rowState>
}
const icons: {
  icon: IconInterface
  onlyOpen?: boolean
  onlyClosed?: boolean
}[] = [
  { icon: MoveUp },
  { icon: MoveDown },
  { icon: More },
  { icon: Copy, onlyOpen: true },
  { icon: Cut, onlyOpen: true },
  { icon: Remove, onlyOpen: true }
]

export const Controls: React.FunctionComponent<{
  index: number
  name: string
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  copyToClipboard: (id: string) => void
  row: StateType.StateDescriptorReturnType<typeof rowState>
  hover: boolean
}> = ({ index, rows, copyToClipboard, row, hover, name }) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!hover) setOpen(false)
  }, [hover])

  return (
    <StyledControls name={name} index={index} className="row-controls">
      {icons
        .filter(el => (!open ? !el.onlyOpen : true))
        .filter(el => (open ? !el.onlyClosed : true))
        .map((el, i) => (
          <el.icon
            key={i}
            index={index}
            rows={rows}
            name={name}
            open={open}
            setOpen={setOpen}
            copyToClipboard={copyToClipboard}
            row={row}
          />
        ))}
    </StyledControls>
  )
}
