import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import axios from 'axios'
import { debounce } from 'lodash'

import * as React from 'react'
import { geogebraState } from '.'

interface ApiData {
  width: number
  height: number
  previewUrl?: string
}
enum Error {
  NotExisting
}
type ApiResponse = ApiData | Error

const cache: { [src: string]: ApiResponse } = {}

const requestAppletData = debounce(
  (setApiResponse: (data: ApiResponse) => void, src?: string) => {
    if (!src) {
      return
    }

    if (cache[src]) {
      setApiResponse(cache[src])
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
                field: [
                  { '-name': 'width' },
                  { '-name': 'height' },
                  { '-name': 'preview_url' }
                ]
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
        let data: ApiResponse = Error.NotExisting
        if (res.data.responses.response.item) {
          const {
            width = 800,
            height = 500,
            previewUrl
          } = res.data.responses.response.item
          data = { width, height, previewUrl }
        }
        cache[src] = data
        setApiResponse(data)
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
const PreviewImage = styled.img({
  maxWidth: '100%',
  height: 'auto'
})
const ScaleContainer = styled.div(
  ({
    disableCursorEvents,
    aspectRatio
  }: {
    disableCursorEvents?: boolean
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
  const [data, setApiResponse] = React.useState<ApiResponse>(Error.NotExisting)
  let id = state.value
  // check if state was the full url
  const match = state.value.match(/geogebra\.org\/m\/(.+)/)
  if (match) {
    id = match[1]
  }

  React.useEffect(() => {
    requestAppletData(setApiResponse, id)
  }, [id])

  if (data === Error.NotExisting) {
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
    const { width, height, previewUrl } = data
    if (disableCursorEvents && previewUrl) {
      return <PreviewImage src={previewUrl} />
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
}

export type GeogebraRendererProps = StatefulPluginEditorProps<
  typeof geogebraState
> & {
  disableCursorEvents?: boolean
}
