import { Plugin, string } from '@edtr-io/plugin'
import { createIcon, faCubes } from '@edtr-io/ui'
import * as React from 'react'

import { GeogebraEditor } from './editor'
import { GeogebraRenderer } from './renderer'

export const geogebraState = string()
export const geogebraPlugin: Plugin<typeof geogebraState> = {
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
