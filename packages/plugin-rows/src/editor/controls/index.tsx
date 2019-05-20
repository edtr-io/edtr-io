import * as React from 'react'
import { StateType } from '@edtr-io/core'

import { Settings } from './settings'
import { MoveControls } from './move-controls'
import { rowsState, rowState } from '../..'

export { createPrimarySettingsWrapper } from './primary-settings'
export { ExtendedSettingsWrapper } from './extended-settings'

export interface SettingsProps {
  name: string
  expanded: boolean
  setShowExtendedSettings: (showExtendedSettings: boolean) => void
}

export interface MoveControlsProps {
  name: string
  index: number
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  row: StateType.StateDescriptorReturnType<typeof rowState>
  connectDragSource: Function //TODO fix me
}

type ControlsProps = SettingsProps & MoveControlsProps

export const Controls = ({
  index,
  expanded,
  setShowExtendedSettings,
  name,
  rows,
  row,
  connectDragSource
}: ControlsProps) => {
  return (
    <React.Fragment>
      <Settings
        name={name}
        expanded={expanded}
        setShowExtendedSettings={setShowExtendedSettings}
      >
        <MoveControls
          name={name}
          index={index}
          rows={rows}
          row={row}
          connectDragSource={connectDragSource}
        />
      </Settings>
    </React.Fragment>
  )
}
