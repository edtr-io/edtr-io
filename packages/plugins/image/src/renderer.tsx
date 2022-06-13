import { isTempFile } from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { ImageProps } from '.'

const ImgWrapper = styled.div<{ maxWidth: number }>((props) => {
  return {
    maxWidth: props.maxWidth > 0 ? `${props.maxWidth}px` : undefined,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  }
})

const Img = styled.img({
  maxWidth: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const Uploading = styled.div({
  position: 'relative',
})
const PendingOverlay = styled.div({
  backgroundColor: 'rgba(255,255,255,0.5)',
  width: '100%',
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Pending = styled.div({
  border: '3px solid hsla(185, 100%, 62%, 0.2)',
  borderTopColor: '#3cefff',
  borderRadius: '50%',
  width: '3em',
  height: '3em',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },
})

export class ImageRenderer extends React.Component<ImageRendererProps> {
  public render() {
    const { state, disableMouseEvents } = this.props
    const alt = state.alt.defined ? state.alt.value : ''
    const image = (
      <ImgWrapper maxWidth={state.maxWidth.defined ? state.maxWidth.value : 0}>
        {!isTempFile(state.src.value) ? (
          <Img src={state.src.value} alt={alt} />
        ) : state.src.value.loaded ? (
          <Uploading>
            <PendingOverlay>
              <Pending />
            </PendingOverlay>
            <Img src={state.src.value.loaded.dataUrl} alt={alt} />
          </Uploading>
        ) : (
          <Img />
        )}
      </ImgWrapper>
    )

    return (
      <div>
        {state.link.defined && state.link.href.value && !disableMouseEvents ? (
          <a
            href={state.link.href.value}
            {...(state.link.openInNewTab.value
              ? {
                  target: '_blank',
                  rel: 'noreferrer noopener',
                }
              : {})}
          >
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    )
  }
}

export type ImageRendererProps = ImageProps & {
  disableMouseEvents?: boolean
}
