import { styled } from '@edtr-io/renderer-ui'
//@ts-ignore
import IframeResizer from 'iframe-resizer-react'
import * as React from 'react'

const Iframe = styled(IframeResizer)({
  width: '100%',
  border: '1px solid #ddd',
  borderRadius: '2px'
})

export const SerloInjectionRenderer = (props: { src: string }) => {
  return (
    <div>
      <Iframe key={props.src} src={props.src} />
    </div>
  )
}
