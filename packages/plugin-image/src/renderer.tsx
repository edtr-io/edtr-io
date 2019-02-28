import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { imageState } from '.'
import { StatefulPluginEditorProps } from '@edtr-io/core'

const Img = styled.img({
  maxWidth: '100%'
})

export class ImageRenderer extends React.Component<ImageRendererProps> {
  render() {
    const { state, disableMouseEvents } = this.props

    const image = (
      <Img src={state.value.src.value} alt={state.value.description.value} />
    )

    return (
      <div>
        {state.value.href.value && !disableMouseEvents ? (
          <a
            href={state.value.href.value}
            target={state.value.target.value}
            rel={state.value.rel.value}
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
