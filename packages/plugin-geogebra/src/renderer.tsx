import { StatefulPluginEditorProps } from '@edtr-io/core'
import axios from 'axios'
import { debounce } from 'lodash'
import * as React from 'react'

import { geogebraState } from '.'
import { styled } from '@edtr-io/ui'

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

const Geogebra = styled.iframe({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none'
})
const ScaleContainer = styled.div(
  ({
    disableCursorEvents,
    aspectRatio
  }: {
    disableCursorEvents: boolean
    aspectRatio: number
  }) => ({
    position: 'relative',
    padding: '0',
    paddingTop: `${100 / aspectRatio}%`,
    display: 'block',
    height: '0',
    overflow: 'hidden',
    pointerEvents: disableCursorEvents ? 'none' : 'auto'
  })
)

export function GeogebraRenderer({
  state,
  disableCursorEvents
}: GeogebraRendererProps) {
  const [{ width, height }, setDimensions] = React.useState({
    width: 800,
    height: 500
  })
  let id = state.value
  // check if state was the full url
  const match = state.value.match(/geogebra\.org\/m\/(.+)/)
  if (match) {
    id = match[1]
  }

  React.useEffect(() => {
    requestHeight(setDimensions, id)
  }, [id])

  if (!id) {
    return (
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
    )
  } else {
    return (
      <ScaleContainer
        aspectRatio={width / height}
        disableCursorEvents={disableCursorEvents || false}
      >
        <Geogebra
          title={id}
          scrolling="no"
          src={'https://www.geogebra.org/material/iframe/id/' + id}
        />
      </ScaleContainer>
    )
  }
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
