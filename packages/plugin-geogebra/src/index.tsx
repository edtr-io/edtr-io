import { StatefulPlugin, StateType } from '@edtr-io/core'
import * as React from 'react'

import { GeogebraEditor } from './editor'
import { GeogebraRenderer } from './renderer'

export const geogebraState = StateType.string()
export const geogebraPlugin: StatefulPlugin<typeof geogebraState> = {
  //eslint-disable-next-line react/display-name
  Component: props =>
    props.editable ? (
      <GeogebraEditor {...props} />
    ) : (
      <GeogebraRenderer {...props} />
    ),
  state: geogebraState,
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    const match = value.match(/geogebra\.org\/m\/(.+)/)
    if (match) {
      return { state: match[1] }
    }
  }
}
