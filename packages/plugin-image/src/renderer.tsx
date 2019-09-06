import { isTempFile, StatefulPluginEditorProps } from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { imageState } from '.'

const ImgWrapper = styled.div<{ maxWidth: number }>(props => {
  return {
    maxWidth: props.maxWidth > 0 ? props.maxWidth + 'px' : undefined,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

const Img = styled.img({
  maxWidth: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto'
})

export class ImageRenderer extends React.Component<ImageRendererProps> {
  public render() {
    const { state, disableMouseEvents } = this.props
    const image = (
      <ImgWrapper maxWidth={state.maxWidth.value}>
        <Img
          src={
            !isTempFile(state.src.value)
              ? state.src.value
              : state.src.value.loaded
              ? state.src.value.loaded.dataUrl
              : ''
          }
          alt={state.description.value}
        />
      </ImgWrapper>
    )

    return (
      <div>
        {state.href.value && !disableMouseEvents ? (
          <a
            href={state.href.value}
            target={state.target.value}
            rel={state.rel.value}
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

export type ImageRendererProps = StatefulPluginEditorProps<
  typeof imageState
> & {
  disableMouseEvents?: boolean
}
