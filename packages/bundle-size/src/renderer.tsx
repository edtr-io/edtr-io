import { Renderer as Core, RendererProps } from '@edtr-io/renderer'
import * as React from 'react'

export function Renderer(props: RendererProps) {
  return <Core {...props} />
}
