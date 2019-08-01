import { Renderer as Core, RendererProps } from '@edtr-io/renderer'
import * as React from 'react'

import { plugins } from './shared/plugins'

export function Renderer(props: RendererProps) {
  return <Core plugins={plugins} {...props} />
}
