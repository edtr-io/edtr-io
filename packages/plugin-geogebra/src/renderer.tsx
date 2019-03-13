import { StatefulPluginEditorProps } from '@edtr-io/core'
import axios from 'axios'
import { debounce } from 'lodash'
import * as React from 'react'

import { geogebraState } from '.'

interface Dimensions {
  width: number
  height: number
}

const cache: { [src: string]: Dimensions } = {}

const requestHeight = debounce(
  (setDimensions: (dim: Dimensions) => void, src?: string) => {
    if (!src) {
      return
    }

    if (cache[src]) {
      setDimensions(cache[src])
      return
    }

    axios
      .post(
        'https://www.geogebra.org/api/json.php',
        {
          request: {
            '-api': '1.0.0',
            task: {
              '-type': 'fetch',
              fields: {
                field: [{ '-name': 'width' }, { '-name': 'height' }]
              },
              filters: {
                field: [{ '-name': 'id', '#text': src }]
              },
              limit: { '-num': '1' }
            }
          }
        },
        // TODO: This is a (temporary?) workaround since GeoGebra Materials API doesn't handle preflight
        // requests correctly.
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      )
      .then(res => {
        const { width, height } = res.data.responses.response.item
        const dim: Dimensions = { width, height }
        cache[src] = dim
        setDimensions(dim)
      })
  },
  500
)

export function GeogebraRenderer({
  state,
  disableCursorEvents
}: GeogebraRendererProps) {
  const [{ width, height }, setDimensions] = React.useState({
    width: 800,
    height: 500
  })

  React.useEffect(() => {
    requestHeight(setDimensions, state.value)
  }, [state.value])

  return (
    <div>
      {state.value ? (
        <iframe
          title={state.value}
          scrolling="no"
          src={'https://www.geogebra.org/material/iframe/id/' + state.value}
          width={width}
          height={height}
          style={{
            border: '0px',
            pointerEvents: disableCursorEvents ? 'none' : 'auto'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            border: '2px lightgrey solid',
            borderRadius: '4px',
            padding: '10px'
          }}
        >
          <img
            src="https://cdn.geogebra.org/static/img/GeoGebra-logo.png"
            alt="Geogebra"
          />
        </div>
      )}
    </div>
  )
}

export type GeogebraRendererProps = StatefulPluginEditorProps<
  typeof geogebraState
> & {
  disableCursorEvents?: boolean
}

export interface GeogebraRendererState {
  id: string
  width: number
  height: number
}
