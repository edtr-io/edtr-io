import { styled } from '@edtr-io/ui'
import fetch from 'isomorphic-unfetch'
import lodash from 'lodash'
import * as React from 'react'

import { GeogebraProps } from '.'

interface ApiData {
  width: number
  height: number
  previewUrl?: string
}

enum Error {
  NotExisting,
}

type ApiResponse = ApiData | Error

const Geogebra = styled.iframe({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none',
})
const PreviewImage = styled.img({
  maxWidth: '100%',
  height: 'auto',
})
const ScaleContainer = styled.div<{
  aspectRatio: number
  disableCursorEvents?: boolean
}>(({ disableCursorEvents, aspectRatio }) => ({
  position: 'relative',
  padding: '0',
  paddingTop: `${100 / aspectRatio}%`,
  display: 'block',
  height: '0',
  overflow: 'hidden',
  pointerEvents: disableCursorEvents ? 'none' : 'auto',
}))

export function GeogebraRenderer({
  state,
  disableCursorEvents,
}: GeogebraRendererProps) {
  let id = state.value
  // check if state was the full url
  const match = /geogebra\.org\/m\/(.+)/.exec(state.value)
  if (match) {
    id = match[1]
  }
  const data = useCachedApiResponse(id)

  if (data === Error.NotExisting) {
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          border: '2px lightgrey solid',
          borderRadius: '4px',
          padding: '10px',
        }}
      >
        <img
          src="https://cdn.geogebra.org/static/img/GeoGebra-logo.png"
          alt="GeoGebra"
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
            src={`https://www.geogebra.org/material/iframe/id/${id}`}
          />
        </ScaleContainer>
      )
    }
  }
}

function useCachedApiResponse(id?: string): ApiResponse {
  const [data, setApiResponse] = React.useState<ApiResponse>(Error.NotExisting)
  const cache = React.useRef<{ [src: string]: ApiResponse }>({})

  const debouncedRequestAppletData = React.useRef<(src?: string) => void>(
    lodash.debounce((src?: string) => {
      if (!src) return

      if (cache.current[src]) {
        setApiResponse(cache.current[src])
        return
      }

      void fetch('https://www.geogebra.org/api/json.php', {
        method: 'POST',
        body: JSON.stringify({
          request: {
            '-api': '1.0.0',
            task: {
              '-type': 'fetch',
              fields: {
                field: [
                  { '-name': 'width' },
                  { '-name': 'height' },
                  { '-name': 'preview_url' },
                ],
              },
              filters: {
                field: [{ '-name': 'id', '#text': src }],
              },
              limit: { '-num': '1' },
            },
          },
        }),
        headers: {
          'Content-Type': 'text/plain',
        },
      })
        .then((res) => res.json())
        .then((body) => {
          let data: ApiResponse = Error.NotExisting
          if (body.responses.response.item) {
            const {
              width = 800,
              height = 500,
              previewUrl,
            } = body.responses.response.item
            data = { width, height, previewUrl }
          }
          cache.current[src] = data
          setApiResponse(data)
        })
    }, 500)
  )

  React.useEffect(() => {
    debouncedRequestAppletData.current(id)
  }, [debouncedRequestAppletData, id])

  return data
}

export type GeogebraRendererProps = GeogebraProps & {
  disableCursorEvents?: boolean
}
