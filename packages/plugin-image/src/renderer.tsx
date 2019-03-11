import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { imageState } from '.'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ImageLoaded } from './upload'

const Img = styled.img({
  maxWidth: '100%'
})

export class ImageRenderer extends React.Component<ImageRendererProps> {
  render() {
    const { state, imagePreview, disableMouseEvents } = this.props

    const image = (
      <Img
        src={imagePreview ? imagePreview.dataUrl : state.src.value}
        alt={state.description.value}
      />
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
  imagePreview?: ImageLoaded
}
