import { StatefulPlugin, StateType } from '@edtr-io/core'
import * as React from 'react'

import { GeogebraEditor } from './editor'
import { GeogebraRenderer } from './renderer'
import { createIcon, faCubes } from '@edtr-io/editor-ui'

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
  title: 'Geogebra Applet',
  description: 'Binde Applets von Geogebratube via Link oder ID ein.',
  icon: createIcon(faCubes),
  onPaste(clipboardData: DataTransfer) {
    const value = clipboardData.getData('text')

    if (/geogebra\.org\/m\/(.+)/.test(value)) {
      return { state: value }
    }
  }
}
