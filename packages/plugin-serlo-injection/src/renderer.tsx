import { styled } from '@edtr-io/renderer-ui'
import * as React from 'react'

const Iframe = styled.iframe({ width: '100%', border: 'none' })

export const SerloInjectionRenderer = (props: {
  key?: string
  ref?: React.RefObject<HTMLIFrameElement>
  src: string
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    // console.log('effect')
    window.addEventListener('message', e => {
      const { data } = e

      // Content width in px
      // console.log(data.contentWidth)
      // Content height in px
      // console.log(data.contentHeight)
      // console.log(data.context)

      // Context is always `serlo`
      if (data.context !== 'serlo') {
        return
      }
      // console.log(iframeRef.current)
      if (iframeRef.current) {
        iframeRef.current.setAttribute('height', data.contentHeight)
      }
    })
  }, [])
  return <Iframe key={props.src} ref={iframeRef} src={props.src} />
}
