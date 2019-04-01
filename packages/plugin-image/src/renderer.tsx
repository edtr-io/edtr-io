import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { imageState } from '.'
import { ImageLoaded } from './upload'

const Img = styled.img({
  width: '100%',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto'
})

export class ImageRenderer extends React.Component<ImageRendererProps> {
  public render() {
    const { state, imagePreview, disableMouseEvents } = this.props
    const maxwidth = state.maxwidth.value
    const styles = maxwidth > 0 ? { maxWidth: maxwidth + 'px' } : {}
    const image = (
      <Img
        src={imagePreview ? imagePreview.dataUrl : state.src.value}
        alt={state.description.value}
        style={styles}
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
