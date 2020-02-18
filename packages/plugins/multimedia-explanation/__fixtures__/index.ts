import { StateTypeSerializedType } from '@edtr-io/plugin'
import * as geogebra from '@edtr-io/plugin-geogebra/__fixtures__'
import * as image from '@edtr-io/plugin-image/__fixtures__'
import * as rows from '@edtr-io/plugin-rows/__fixtures__'
import * as video from '@edtr-io/plugin-video/__fixtures__'

import {
  MultimediaExplanationPluginState,
  createMultimediaExplanationPlugin
} from '../src'

export const name = 'multimediaExplanation'
export const plugin = createMultimediaExplanationPlugin({
  explanation: { plugin: 'rows' },
  plugins: [
    {
      name: image.name,
      title: 'Image'
    },
    {
      name: video.name,
      title: 'Video'
    },
    {
      name: geogebra.name,
      title: 'GeoGebra'
    }
  ]
})

export const states: Record<
  string,
  StateTypeSerializedType<MultimediaExplanationPluginState>
> = {
  illustrating: {
    explanation: { plugin: rows.name, state: rows.states.simple },
    multimedia: {
      plugin: image.name,
      state: image.states.simple
    },
    illustrating: true,
    width: 50
  },
  explaining: {
    explanation: { plugin: rows.name, state: rows.states.simple },
    multimedia: {
      plugin: image.name,
      state: image.states.simple
    },
    illustrating: false,
    width: 50
  }
}
