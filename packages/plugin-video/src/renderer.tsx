import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, styled, faFilm } from '@edtr-io/editor-ui'
import * as React from 'react'

import { videoState } from '.'

const VideoPlaceholderWrapper = styled.div({
  position: 'relative',
  width: '100%',
  textAlign: 'center'
})

enum VideoType {
  YouTube = 'youtube',
  Vimeo = 'vimeo',
  Wikimedia = 'wikimedia',
  BR = 'br'
}

const VideoWrapper = styled.div<{ disableCursorEvents: boolean }>(
  ({ disableCursorEvents }) => ({
    position: 'relative',
    padding: '0',
    /* Player ratio: 100 / (1280 / 720) */
    paddingTop: '56.25%',
    display: 'block',
    height: '0',
    overflow: 'hidden',
    pointerEvents: disableCursorEvents ? 'none' : 'auto'
  })
)

const Video = styled.video({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none'
})

const VideoIframe = styled.iframe({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none'
})

export type VideoRendererProps = StatefulPluginEditorProps<
  typeof videoState
> & {
  disableCursorEvents?: boolean
}

export function VideoRenderer(props: VideoRendererProps) {
  const data = getMatchingData(props.state())
  if (!data) {
    return (
      <VideoPlaceholderWrapper>
        <Icon icon={faFilm} size="5x" />
        <p>{props.state() ? 'Fehlerhafte URL' : null}</p>
      </VideoPlaceholderWrapper>
    )
  }

  if (data.type === VideoType.Wikimedia) {
    return (
      <VideoWrapper disableCursorEvents={!!props.disableCursorEvents}>
        <Video controls src={data.embed} />
      </VideoWrapper>
    )
  }

  return (
    <VideoWrapper disableCursorEvents={!!props.disableCursorEvents}>
      <VideoIframe allowFullScreen src={data.embed} />
    </VideoWrapper>
  )
}

function getMatchingData(url: string) {
  return (
    checkMatch(url, VideoType.YouTube) ||
    checkMatch(url, VideoType.Vimeo) ||
    checkMatch(url, VideoType.Wikimedia) ||
    checkMatch(url, VideoType.BR)
  )
}

function checkMatch(
  url: string,
  type: VideoType
):
  | {
      embed: string
      type: VideoType
    }
  | undefined {
  switch (type) {
    case VideoType.YouTube: {
      const match = url.match(
        /^(https?:\/\/)?(.*?youtube\.com\/watch\?(.*&)?v=|.*?youtu\.be\/)(.+)/
      )
      if (match) {
        return {
          embed: `https://www.youtube-nocookie.com/embed/${match[4]}?html5=1`,
          type: VideoType.YouTube
        }
      }
      break
    }
    case VideoType.Vimeo: {
      const match = url.match(/^(https?:\/\/)?(.*?vimeo\.com\/)(.+)/)
      if (match) {
        return {
          embed: `https://player.vimeo.com/video/${match[3]}`,
          type: VideoType.Vimeo
        }
      }
      break
    }
    case VideoType.Wikimedia: {
      const match = url.match(
        /^(https?:\/\/)?(.*?upload\.wikimedia\.org\/)(.+)/
      )
      if (match) {
        return {
          embed: url,
          type: VideoType.Wikimedia
        }
      }
      break
    }
    case VideoType.BR: {
      const match = url.match(/^(https?:\/\/)?(.*?br\.de\/)(.+)/)
      if (match) {
        return {
          embed: `https://www.br.de/mediathek/embed/${match[3]}`,
          type: VideoType.BR
        }
      }
      break
    }
  }
  return undefined
}
